const path = require('path')
const express = require('express')
const hbs = require('hbs')
const port = process.env.PORT || 4000
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

//Mendefinisikan jalur/path untuk konfigurasi Express
const app = express()
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

//app.set('view engine', 'hbs')
app.use(express.static(direktoriPublic))

//ini halaman/page utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Weatherytics',
        nama: 'Naufal Ihsan'
    })
})
//ini halaman bantuan/FAQ (Frequently Asked Question)
app.get('/bantuan', (req,res) => {
    res.render('bantuan', {
        teksBantuan: 'Bantuan apa yang anda butuhkan?',
        judul: 'FAQ',
        nama: 'Naufal Ihsan'
    })
})
// ini halaman infoCuaca
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})
// ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'About',
        nama: 'Naufal Ihsan'
    })
})

app.get('/bantuan/*',(req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Naufal Ihsan',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Naufal Ihsan',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

// menjalankan server di port 4000
app.listen(port, () => {
    console.log('Server berjalan di port ' + port)
})