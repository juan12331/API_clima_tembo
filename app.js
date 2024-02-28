const express = require ('express');
const axios = require ('axios');
const path = require ('path');
const cors = require ('cors');
const config = require ('./config.json');
const apikey = config.apikey;

const app = express();
app.listen(80);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function traducaoClima() {
    return {
        "Thunderstorm": "Tempestade",
        "thunderstorm with light rain": "Tempestade com chuva leve",
        "thunderstorm with rain": "Tempestade com chuva",
        "thunderstorm with heavy rain": "Tempestade com chuva intensa",
        "light thunderstorm": "Tempestade leve",
        "thunderstorm": "Tempestade",
        "heavy thunderstorm": "Tempestade intensa",
        "ragged thunderstorm": "Tempestade irregular",
        "thunderstorm with light drizzle": "Tempestade com garoa leve",
        "thunderstorm with drizzle": "Tempestade com garoa",
        "thunderstorm with heavy drizzle": "Tempestade com garoa intensa",
        
        "Drizzle": "Garoa",
        "light intensity drizzle": "Garoa de baixa intensidade",
        "drizzle": "Garoa",
        "heavy intensity drizzle": "Garoa de alta intensidade",
        "light intensity drizzle rain": "Chuva garoando de baixa intensidade",
        "drizzle rain": "Chuva garoando",
        "heavy intensity drizzle rain": "Chuva garoando de alta intensidade",
        "shower rain and drizzle": "Chuva forte e garoa",
        "heavy shower rain and drizzle": "Chuva forte e garoa intensa",
        "shower drizzle": "Garoa forte",
      
        "Rain": "Chuva",
        "light rain": "Chuva leve",
        "moderate rain": "Chuva moderada",
        "heavy intensity rain": "Chuva intensa",
        "very heavy rain": "Chuva muito intensa",
        "extreme rain": "Chuva extrema",
        "freezing rain": "Chuva congelante",
        "light intensity shower rain": "Chuva de baixa intensidade",
        "shower rain": "Chuva",
        "heavy intensity shower rain": "Chuva de alta intensidade",
        "ragged shower rain": "Chuva irregular",
      
        "Snow": "Neve",
        "light snow": "Neve leve",
        "snow": "Neve",
        "heavy snow": "Neve intensa",
        "sleet": "Aguaceiro",
        "light shower sleet": "Aguaceiro leve",
        "shower sleet": "Aguaceiro",
        "light rain and snow": "Chuva e neve leve",
        "rain and snow": "Chuva e neve",
        "light shower snow": "Neve e chuva leve",
        "shower snow": "Neve e chuva",
        "heavy shower snow": "Neve e chuva intensa",
      
        "Atmosphere": "Atmosfera",
        "mist": "Névoa",
        "smoke": "Fumaça",
        "haze": "Neblina",
        "sand/dust whirls": "Redemoinhos de areia/poeira",
        "fog": "Nevoeiro",
        "sand": "Areia",
        "dust": "Poeira",
        "volcanic ash": "Cinzas vulcânicas",
        "squalls": "Rajadas",
        "tornado": "Tornado",
      
        "Clear": "Céu limpo",
        "clear sky": "Céu limpo,
      
        "Clouds": "Nuvens",
        "few clouds": "Poucas nuvens",
        "scattered clouds": "Nuvens dispersas",
        "broken clouds": "Nuvens fragmentadas",
        "overcast clouds": "Nublado"
    }
}

app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade;

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
            
        if(response.status === 200){
                const clima = traducaoClima()[response.data.weather[0].description] || response.data.weather[0].description;
                const iconUrl = `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`;
                
                const weatherData = {
                    nome: response.data.name,
                    pais: response.data.sys.country,
                    temperatura: response.data.main.temp,
                    umidade: response.data.main.humidity,
                    velocidadeDoVento: response.data.wind.speed,
                    clima: clima,
                    iconUrl: iconUrl
                };

                console.log(response.data);

                res.send(weatherData);
            } else{
                res.status(response.status).send({erro: 'Erro ao obter dados meteorologicos'});
            }
    } catch (error){
        res.status(500).send({erro: 'Erro ao obter dados meteorologicos', error });
    }
})
