$( "#add_bed" ).click(function() {
var str=$(".bedtoadd").html();
var res = "<div class='bedadd'>"+str+"</div>";
$(".repeat").append(res);
});
$(document).on('click','.remove',function(){
$(this).parent().remove();
});
$(document).on('click','#submit_button',function(){
	var data={};
	data.bedname=[];
	$( ".bedname" ).each(function(index){
	data.bedname[index]=$(this).val();;
	});
					$.ajax({
							type: 'POST',
							data: JSON.stringify(data),
					        contentType: 'application/json',
	                        url: '/addbed',						
	                        success: function(data) {
	                            window.location='/';
	                        }
	                    });

});
