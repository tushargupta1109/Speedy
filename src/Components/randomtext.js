var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://montanaflynn-lorem-text-generator.p.rapidapi.com/paragraph',
  params: {length: '3', count: '1'},
  headers: {
    'x-rapidapi-host': 'montanaflynn-lorem-text-generator.p.rapidapi.com',
    'x-rapidapi-key': '56115c4683msh107ac4ee8de0268p1c9192jsneb3de4f3690a'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});