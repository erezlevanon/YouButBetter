/**
 * Controller for the interface.
 * @param $scope
 */
function interfaceController($scope) {
    this.scope = $scope;
    this.chosenTraits = [];


    this.addTrait = (name) => {
        if (!this.isTraitChosen(name)) {
            this.chosenTraits.unshift(name);
        }
    };

    this.isTraitChosen = (name) => {
        return this.chosenTraits.some((existing) => existing === name)
    }
}