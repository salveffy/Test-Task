const api = 'f8466e1c5979affa91440ace605a0964'
// Координаты СПБ
let lat = 59.9386300
let lon = 30.3141300

let coord = document.querySelector('#coord')
let minWeather = document.querySelector('#minWeather')
let maxDuration = document.querySelector('#maxDuration')

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${api}&units=metric&lang=ru`)
  .then(resp => {return resp.json()})
  .then(data => {
    coord.textContent = `Координаты: ${data.lat}, ${data.lon}`;
    task1(data);
    task2(data);
  })
  .catch(()=> {

  })

  function task1(data) {
    let arrDiffTemp = [];
    let diffDay = [];
    for (let i = 0; i < data.daily.length; i++) {
      diffDay.push(new Date(data.daily[i].dt * 1000));
      arrDiffTemp[i] = data.daily[i].feels_like.night - data.daily[i].temp.night;
      if (arrDiffTemp[i] < 0) {
        arrDiffTemp[i] = arrDiffTemp[i] * (-1);
      }
    }
    let different = Math.min(...arrDiffTemp);
    let correctDiff = Math.round(different *10)/10;
    let rightDay = diffDay[arrDiffTemp.indexOf(different)];
    minWeather.textContent = `День, с минмальной разницей "ощущаемой" и фактической температуры ночью будет ${convertDate(rightDay)} с разницей ${correctDiff}°`
  }

  function task2(data) {
    let arrDuration = [];
    let day = [];
    let arrWeather = data.daily.slice(0,5); //Так как нам нужно всего лишь 5 дней, то обрезаем массив
    for (let i = 0; i < arrWeather.length; i++) {
      day.push(new Date(arrWeather[i].dt * 1000)); // Переводим unixtime в стандартный вид и заполняем массив
      arrDuration[i] = arrWeather[i].sunset - arrWeather[i].sunrise; // Находим разницу за 5 дней
    }
    let duration = Math.max(...arrDuration); // Находим максимальную продолжительность светового дня
    let correctDuration = Math.round((duration/60/60) * 10)/10; // Переводим секунды в часы и округляем
    let maxDay = day[arrDuration.indexOf(duration)]; // Находим дату этого дня
    maxDuration.textContent = `Максимальная продолжительность светового дня за 5 дней будет ${convertDate(maxDay)} продолжительностью ${correctDuration} часов`;
}

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}