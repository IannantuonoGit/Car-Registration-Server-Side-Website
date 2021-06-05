var cars = new Array();
var people = new Array();
var stores = new Array();

var fs = require('fs');

module.exports.initalize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/people.json', 'utf-8', (err, data)=> {
            if (err) {reject(err); return;}
            people = JSON.parse(data);

        fs.readFile('./data/cars.json', 'utf-8',  (err, data) => {
            if (err) {reject(err); return;}
            cars = JSON.parse(data);

         fs.readFile('./data/stores.json', 'utf-8', (err, data) => {
            if (err) {reject(err); return;}
            stores = JSON.parse(data);
                    
        resolve("Success able to read from file");
                });
            });
        });
    });
}

module.exports.getAllPeople = function(){
    return new Promise((resolve, reject) => {
        if (people.length == 0){
            reject("No results returned");
        } else { 
            resolve(people);
        }
    });
}

module.exports.addPeople = function(peopleData){
    return new Promise((resolve, reject) =>{
        peopleData.id = people.length  + 1;
        people.push(peopleData);
        resolve();
    });
}

module.exports.getCars = function(){
    return new Promise((resolve, reject) => {
        if (cars.length == 0){
            reject("No results returned");
        } else { 
            resolve(cars);
        }
    });
}

module.exports.getStores = function(){
    return new Promise((resolve, reject) => {
        if (stores.length == 0){
            reject("No results returned");
        } else { 
            resolve(stores);
        }
    });
}

module.exports.getPeopleByVin = function(vin){
    return new Promise((resolve, reject) => {
        var localPeople = people.filter(vi => vi.vin == vin);
        if(localPeople.length == 0){
            reject("No results returned");
        } else {
            resolve(localPeople);
        }
    });
}

module.exports.getCarsByVin = function(vin){
    return new Promise((resolve, reject) => {
        var localCars = cars.filter(vi => vi.vin == vin);
        if(localCars.length == 0){
            reject("No results returned");
        } else {
            resolve(localCars);
        }
    });
}

module.exports.getCarsByMake = function(make){
    return new Promise((resolve, reject) => {
        var localMake = cars.filter(vi => vi.make == make);
        if(localMake.length == 0){
            reject("No results returned");
        } else {
            resolve(localMake);
        }
    });
}

module.exports.getCarsByYear = function(year){
    return new Promise((resolve, reject) => {
        var localYear = cars.filter(vi => vi.year == year);
        if(localYear.length == 0){
            reject("No results returned");
        } else {
            resolve(localYear);
        }
    });
}

module.exports.getPeopleById = function(id){
    return new Promise((resolve, reject) => {
        var localID = people.filter(vi => vi.id == id);
        
        if(localID.length == 0){
            reject("No results returned");
        } else {
            resolve(localID[0]);
        }
    });
}

module.exports.getStoresByRetailer = function(retailer){
    return new Promise((resolve, reject) => {
        var localStore = stores.filter(vi => vi.retailer == retailer);

        if(localStore.length == 0){
            reject("No results returned")
        } else {
            resolve(localStore);
        }
    });
}

module.exports.updatePerson = function(personData){
    return new Promise((resolve, reject) => {
        for(var i = 0; i < people.length; i++){
            if (people[i].id == personData.id) {
                people[i] = personData;
                resolve();
            }
        };
        reject();
    });
}