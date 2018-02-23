var $sm_min = matchMedia('(min-width: 30rem)'),
$md_min = matchMedia('(min-width: 40rem)'),
$lg_min = matchMedia('(min-width: 58.75rem)'),
$xl_min = matchMedia('(min-width: 77.5rem)');

const sections = [
'#Top',
'#Objective',
'#Employment',
'#Projects', 
'#Skills', 
'#More'
];

let activeSection = undefined;

const unique = (arr) => {
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


let skillArrays = [],
skills = [],
checkedSkills = [];

const layoutIsMediumOrLarger = () => $md_min.matches === true;
const topHeightCompensation = 58;

const updateActiveSection = () => {
	var cutoff = $(window).scrollTop();
	if (layoutIsMediumOrLarger()) cutoff += topHeightCompensation;
	$.each(sections, (index, value) => {
		if($(value).offset().top + $(value).height() > cutoff) {
			$('section, nav a').removeClass('active');
			$(`a[href=${value}]`).addClass('active');
			activeSection = value;
			return false;
		}
	});
};

const scrollToTarget = ($target, highlight) => {
	var offset = ($target.is('#Top')) ? 0 : $target.offset().top;
	if (layoutIsMediumOrLarger()) offset -= topHeightCompensation;
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

$(function() {
	const navLinks = document.querySelectorAll('nav a');
	const footerJumpLinks = document.querySelectorAll('footer [class*=jump]');
	const skillWidget = {
		build() {
			$('.skills').find('li').each(function(){
				var skillTags = $(this).data('skills').split(', ');
				skillArrays.push(skillTags);
			})
			$.each(skillArrays, function(){
				skills = skills.concat(this);
			}); 
			var uniqueSkills = unique(skills);

			$('#Skills').find('h1').after('<h2>Filter by tag:</h2><form class="skill-filter"></form>');
			$.each(uniqueSkills,function(index, value){
				var progName = value.replace(' ','-');
				$('#Skills').find('.skill-filter').append(`<label for="${progName}"><input id="${progName}" type="checkbox" value="${value}"/> ${value}</label>`);
			});
			$('#Skills').find('.skill-filter').append(`<label class="clear-label"><a href="#" class="clear-filters"><svg fill="white" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path d="M4 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-1.5 1.78l1.5 1.5 1.5-1.5.72.72-1.5 1.5 1.5 1.5-.72.72-1.5-1.5-1.5 1.5-.72-.72 1.5-1.5-1.5-1.5.72-.72z" />
				</svg>clear filters</a></label>`);
		},
		bindEvents() {
			$('#Skills [type=checkbox]').on('change.filterSkills', function(e){
				skillWidget.updateList($(this));
			});
			$('.clear-filters').on('click.filterSkills', function(e){
				e.preventDefault();
				$('.skills form [type=checkbox]').attr('checked', false);
				$('#Skills [type=checkbox]').trigger('change.filterSkills');
			});
		},
		toggleMenu(breakpoint) {
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
		updateList($input) {
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
			skillWidget.bindEvents();
			skillWidget.toggleMenu($sm_min);
		}
	};
	
	skillWidget.init();
	updateActiveSection();

	$sm_min.onchange = () => skillWidget.toggleMenu($sm_min);
	$md_min.onchange = () => document.querySelector('body').classList.remove('overlay-visible');

	$('.menu-toggle').on('click.menuToggle', (e) => {
		e.preventDefault();
		$('body').toggleClass('overlay-visible');
	});

	window.addEventListener('scroll', () => updateActiveSection());

	navLinks.forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const href = link.getAttribute('href');
			scrollToTarget($(href), true);
			$('body').removeClass('overlay-visible');
		});
	});

	footerJumpLinks.forEach((link) => {
		link.addEventListener('click', (e) => {
			let targetSection;
			e.preventDefault();
			if (e.target.classList.contains('jump-next')) targetSection = sections[sections.indexOf(activeSection)+1];
			if (e.target.classList.contains('jump-prev')) targetSection = sections[sections.indexOf(activeSection)-1];
			if (typeof targetSection !== "undefined") scrollToTarget($(targetSection), true);
		});
	});
});
 
