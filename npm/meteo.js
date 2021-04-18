let weather = require('weather-js');

weather.find({search: 'Valence, FR', degreeType: 'C'}, function(err, result) {
    if(err) {
        console.log(err);
    } else {
        //console.log(JSON.stringify(result, null, 2));
        const {temperature, skytext} = result[0].current;
        console.log('Météo à ' + result[0].location.name);
        console.log('La température est de ' + temperature);
        console.log('Etat du ciel : ' + skytext);
    }
});