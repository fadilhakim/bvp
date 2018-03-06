
function searchCity(){
	$('#cities').hide();
	$('#cities').children().remove();
	$('[name=cityPrice]').val('');
	$('[name=cityPriceId]').val('');
	if($('[name=cityName]').val()){
		backendSearch($('[name=cityName]').val(), 'cities');
	}
}

function searchCityPrice(){
	$('#citiesPrice').hide();
	$('#citiesPrice').children().remove();
	$('[name=cityName]').val('');
	$('[name=cityId]').val('');
	if($('[name=cityPrice]').val()){
		backendSearch($('[name=cityPrice]').val(), 'citiesPrice');
	}
}

function selectCity(city){
	if($('[name=cityName]').val()){
		$('[name=cityName]').val(city.name);
		$('[name=cityId]').val(city.id);
		$('#cities').hide();
		$('#cities').children().remove();
	}else {
		$('[name=cityPrice]').val(city.name);
		$('[name=cityPriceId]').val(city.id);
		$('#citiesPrice').hide();
		$('#citiesPrice').children().remove();
		checkPrice();
	}
}

function backendSearch(val, className) {
	if(val){
		axios.get('https://secure-cdn-api.bridestory.com/v2/cities/search?limit=10&keyword=' + val)
		.then(function (response) {
			if(response.data.cities){
				$('#'+className).show();
				response.data.cities.map(function(city, index){
					if(index < 10){
						var cityParam = {'id' : city.id, 'name' : city.name}
						$('#'+className).append("<li onClick='selectCity("+ JSON.stringify(cityParam) +")'>"+ city.name +"</li>");	
					}
				})
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}

function checkPrice(){
	var cityId = $('[name=cityId]').val() || $('[name=cityPriceId]').val();
	axios.get('https://secure-cdn-api.bridestory.com/v2/subscribes?cityIds='+ cityId +'&include=basePrice')
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
}