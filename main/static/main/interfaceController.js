/**
 * Controller for the interface.
 * @param $scope
 */
function interfaceController($scope) {
    this.scope = $scope;
    this.curPrice = 0;
    this.chosenTraits = [];


    this.toggleTrait = (name) => {
        if (!this.isTraitChosen(name)) {
            this.chosenTraits.push(name);
        } else {
            let index = this.chosenTraits.indexOf(name);
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
            }

        }
    };

    this.isTraitChosen = (name) => {
        return this.chosenTraits.some((existing) => existing === name)
    };

    this.currentPriceFormatted = () => {
        return this.curPrice;
    };
}