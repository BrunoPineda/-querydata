const OPTIONS = {
    method: 'GET'

}
const OPTIONS_IP = {
    method: 'GET',

    headers: {
        'X-RapidAPI-Key': 'f56aab7218msh451e94a13a5253bp14a2e8jsnd5da34719259',
        'X-RapidAPI-Host': 'ip-geolocation-and-threat-detection.p.rapidapi.com'
    }
}

const fetchMyCurrentIP = ip => {
    return fetch(`https://api.ipify.org/?format=json`, OPTIONS)
        .then(res => res.json())
        .catch(err => console.error(err))
}

const fetchIpInfo = ip => {
    return fetch(`https://ip-geolocation-and-threat-detection.p.rapidapi.com/${ip}`, OPTIONS_IP)
        .then(res => res.json())
        .catch(err => consolo.error(err))
}


const fetchdniInfo = dni => {
    return fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJydW5vLnBpbmVkYUB1cnAuZWR1LnBlIn0.QeLj6lARqPfamjoHqsn4eR4QQ56XDz3JhVoKacA4SOk`, OPTIONS)
        .then(res => res.json())
        .catch(err => console.error(err))

}

const $ = selector => document.querySelector(selector)
const $form = $('#form')
const $input = $('#input')
const $submit = $('#submit')
const $results = $('#results')

const $name = $('#name')
const $lastname1 = $('#lastname1')
const $lastname2 = $('#lastname2')

const $IP = $('#ip')

$form.addEventListener('submit', async(event) => {
    event.preventDefault()
    const { value } = $input
    if (!value) return

    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')

    const ipInfo = await fetchMyCurrentIP(value)
    const dniInfo = await fetchdniInfo(value)


    const ip = ipInfo.ip;
    const name = dniInfo.nombres;
    const lastname1 = dniInfo.apellidoPaterno;
    const lastname2 = dniInfo.apellidoMaterno;

    const ipInfo_data = await fetchIpInfo(ip)

    const internet = ipInfo_data.company.domain;
    const distrito = ipInfo_data.location.region.name;




    if (dniInfo) {
        $IP.value = ip;
        $name.value = name;
        $lastname1.value = lastname1;
        $lastname2.value = lastname2;
        $results.innerHTML = JSON.stringify(ipInfo_data, null, 2)
    }
    $submit.removeAttribute('disabled', '')
    $submit.removeAttribute('aria-busy', 'true')

    fetch('https://sheet.best/api/sheets/29da586f-7b02-4122-a053-aba6245a4bf7', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "DNI": $form.input.value,
            "Nombre": $form.name.value,
            "Apellido Paterno": $form.lastname1.value,
            "Apellido Materno": $form.lastname2.value,
            "IP": $form.ip.value,
            "Ver más datos de ip": "https://es.infobyip.com/ip-" + ip + ".html"
        })
    })

    Swal.fire({
        title: 'El gato hacker dice que eres de ' + distrito + ' y tienes como provedor de internet a ' + internet + ' :D gracias',
        width: 600,
        padding: '3em',
        color: '#000000',
        background: '#000000 url(https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Big_Floppa_and_Justin_2_%28cropped%29.jpg/640px-Big_Floppa_and_Justin_2_%28cropped%29.jpg)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://c.tenor.com/SoBzDkrJuNUAAAAC/cat-hack.gif")
          left top
          no-repeat
        `
    })

})