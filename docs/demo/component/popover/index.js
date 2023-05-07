/** @param element {HTMLElement} 
    @param elementOriginal {HTMLElement} */
export default function(element, elementOriginal) {
    var $element = $(element);
    var $action_pop = $element.find('.action-pop');
    var $content = $element.find('.popup-content');

    $(element).on('click', '.action-pop', function() {
        intell.ctrl.TargetPopup.showAt($content[0], $action_pop[0]); 
    });
}