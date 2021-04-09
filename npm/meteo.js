let weather = require('weather-js');

weather.find({search: 'Valence, FR', degreeType: 'C'}, function(err, result) {
    if(err) {
        console.log(err);
    } else {
        //console.log(JSON.stringify(result, null, 2));
        console.log('Météo à ' + result[0].location.name);
        console.log('La température est de ' + result[0].current.temperature);
        console.log('Etat du ciel : ' + result[0].current.skytext);
    }
});