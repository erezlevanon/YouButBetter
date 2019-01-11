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
        } else {
            let index = this.chosenTraits.indexOf(name);
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
            }

        }
    };

    this.isTraitChosen = (name) => {
        return this.chosenTraits.some((existing) => existing === name)
    }
}