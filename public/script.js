const movieName = document.querySelector('#name')
const year = document.querySelector('#year')
const form = document.querySelector('form')
const loading = document.querySelector('p')
const video = document.querySelector('video')

const fetchy = async(e)=>{
    e.preventDefault()
    const options = {
        name: movieName.value,
        year: year.value
    }
    year.value = ''
    movieName.value = ''
    loading.style.display = 'block'
    const req = await axios.post('http://localhost:3000/api', options)
    loading.style.display = 'none'
    const url = req.data.URL
    video.setAttribute('src', url)
}


form.addEventListener('submit', fetchy)
