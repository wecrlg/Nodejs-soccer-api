import axios from 'axios';
import { load } from 'cheerio';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';


const app = express();
app.use(cors())
const newspapers = [
    {
        name: "skysports",
        address: "https://www.skysports.com/arsenal"
    },
    {
        name: "newsnow",
        address: "https://www.newsnow.com/ng/Sport/Football/Premier+League/Arsenal"
    },
    {
        name: "supersport",
        address: "https://supersport.com/search?q=arsenal"
    },
    {
        name: "eurosport",
        address: "https://www.eurosport.com/search.shtml"
    }
]
const articles = []

app.get('/', (req, res) => {
    res.send('Welcome to Soccer Trips');
})

app.get('/arsenal', (req, res) => {
    newspapers.forEach(async (newspaper) => {
        const response = await axios.get(newspaper.address)
        if (!response) throw new Error('Cannot connect to server')
        const html = response.data;
        const $ = load(html)
        $("a:contains('arsenal')", html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({ title, url, source: newspaper.name });
        })
    })

    res.send(articles)
})


app.get('/arsenal:newsId', (req, res) => {
    const newspaperId = req.params.newsId

    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
})




const PORT = process.env.PORT || 5400
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
