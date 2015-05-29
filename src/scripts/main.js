var $sm_min = matchMedia('(min-width: 30rem)'),
$md_min = matchMedia('(min-width: 40rem)'),
$lg_min = matchMedia('(min-width: 58.75rem)'),
$xl_min = matchMedia('(min-width: 77.5rem)');

var sections = [
'#Top',
'#Objective',
'#Projects', 
'#Skills', 
'#Employment',
'#Education',
'#Bio'
],
activeSection = undefined;

function unique(arr) {
var i,
    len = arr.length,
    out = [],
    obj = { };

for (i = 0; i < len; i++) {
    obj[arr[i]] = 0;
}
for (i in obj) {
    out.push(i);
}
return out;
};


var skillArrays = [],
skills = [],
checkedSkills = [],
skillWidget;

var updateActiveSection = function(){
	var cutoff = $(window).scrollTop();
	if ($md_min.matches === true) cutoff +=58;
	$.each(sections, function(index, value){
		if($(value).offset().top + $(value).height() > cutoff) {
			$('section, nav a').removeClass('active');
			$('a[href='+value+']').addClass('active');
			activeSection = value;
			return false;
		}
	});
};

var scrollToTarget = function($target, highlight){
	var offset = ($target.is('#Top')) ? 0 : $target.offset().top;
	if ($md_min.matches === true) offset -= 58;
	$('html, body').stop().animate({
		scrollTop: offset
	}, 300);
	if (highlight) {
		$target.addClass('highlight');
		setTimeout(function(){
			$target.removeClass('highlight');
		}, 1000);
	}
};

$(function(){
	skillWidget = {
		build: function(){
			$('.skills').find('li').each(function(){
				var skillTags = $(this).data('skills').split(', ');
				skillArrays.push(skillTags);
			});
			$.each(skillArrays, function(){
				skills = skills.concat(this);
			}); 
			var uniqueSkills = unique(skills);

			$('#Skills').find('h1').after('<h2>Filter by tag:</h2><form class="skill-filter"></form>');
			$.each(uniqueSkills,function(index, value){
				var progName = value.replace(' ','-');
				$('#Skills').find('.skill-filter').append('<label for="'+progName+'"><input id="'+progName+'" type="checkbox" value="'+value+'"/> '+value+'</label>')
			});
			$('#Skills').find('.skill-filter').append('<label class="clear-label"><a href="#" class="clear-filters"><svg fill="white" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path d="M4 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-1.5 1.78l1.5 1.5 1.5-1.5.72.72-1.5 1.5 1.5 1.5-.72.72-1.5-1.5-1.5 1.5-.72-.72 1.5-1.5-1.5-1.5.72-.72z" />
				</svg>clear filters</a></label>');
		},
		toggleMenu: function(breakpoint){
			if (!breakpoint.matches) {
				$('.skills h2').addClass('toggle').on('click', function(){
					$(this).toggleClass('showing');
					$('.skills form').toggleClass('visible');
				});
			}
			else {
				$('.skills h2').removeClass('toggle showing').off('click');
				$('.skills form').removeClass('visible');
			} 
		},
		updateList: function($input){
			var value = $input.val();
			if ($input.is(':checked')) checkedSkills.push(value);
			else checkedSkills.splice(checkedSkills.indexOf(value),1);

			$('.skills').find('li').removeClass('visible highlight');

			if (checkedSkills.length > 0) {
				$('.skills').find('li').hide().each(function(){
					var $skill = $(this);
					var skillTags = $(this).data('skills').split(', ');
					$.each(checkedSkills, function(index, val){
						if (skillTags.indexOf(val) !== -1) $skill.addClass('visible');
					});
					if (skillTags.indexOf(value) !== -1) $skill.addClass('highlight');
				});

				$('.skills').find('li.visible').show();
				setTimeout(function(){
					$('.skills').find('li.visible').removeClass('highlight');
				}, 1000);
				$('.skills .clear-filters').show();
			}
			else {
				$('.skills').find('li').show();
				$('.skills').find('.clear-filters').hide();
			} 
		},
		init: function(){
			skillWidget.build();

			$('#Skills [type=checkbox]').on('change.filterSkills', function(e){
				skillWidget.updateList($(this));
			});
			$('.clear-filters').on('click.filterSkills', function(e){
				e.preventDefault();
				$('.skills form [type=checkbox]').attr('checked', false);
				$('#Skills [type=checkbox]').trigger('change.filterSkills');
			});

			skillWidget.toggleMenu($sm_min);
		}
	};
	
	$('.menu-toggle').on('click.menuToggle',function(e){
		e.preventDefault();
		$('body').toggleClass('overlay-visible');
	});
	$('nav a').on('click', function(e){
		e.preventDefault(); var $target = $($(this).attr('href'));
		scrollToTarget($target, true);
		$('body').removeClass('overlay-visible');
	});
	$('footer [class*=jump]').on('click.jump', function(e){
		e.preventDefault(); var targetSection;
		if ($(this).is('.jump-next')) targetSection = sections[sections.indexOf(activeSection)+1];
		if ($(this).is('.jump-prev')) targetSection = sections[sections.indexOf(activeSection)-1];
		if (typeof targetSection !== "undefined") scrollToTarget($(targetSection), true);
	});
	skillWidget.init();
	updateActiveSection();
	$(window).on('scroll.sections', function(){ 
		updateActiveSection();
	});
});
 

$sm_min.onchange = function() { 
	skillWidget.toggleMenu($sm_min);
};
$md_min.onchange = function(breakpoint){
	$('body').removeClass('overlay-visible');
};

// //google analytics
// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// 	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// 	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-63021211-1', 'auto');
// ga('send', 'pageview');