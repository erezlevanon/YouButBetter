/**
 * Controller for the interface.
 * @param $scope
 */
function interfaceController($scope) {
    this.scope = $scope;
    this.curPrice = 0;
    this.curSalePrice = 0;
    this.chosenTraits = [];

    this.DEFAULT_NUMBER_OF_TRAITS = 50;

    for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {
        this.chosenTraits.push({title: '', price: 0, sale_price: 0});
    }

    this.toggleTrait = (name, price, sale_price) => {
        if (!this.isTraitChosen(name)) {
            this.chosenTraits.splice(this.randomLoc(), 0, {title: name, price: price, sale_price: sale_price});
            this.curPrice += price;
            this.curSalePrice += sale_price;
        } else if (name !== '') {
            let index = this.chosenTraits.indexOf(this.chosenTraits.find((val) => val.title === name));
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.curPrice -= price;
                this.curSalePrice -= sale_price;
            }

        }
    };

    this.isTraitChosen = (name) => {
        return this.chosenTraits.some((existing) => existing.title === name)
    };

    this.currentPriceFormatted = () => {
        return this.curPrice;
    };

    this.currentSalePriceFormatted = () => {
        return this.curSalePrice;
    };

    this.traitToBinary = (name) => {
        return '0';
    };

    this.randomLoc = () => {
        return Math.floor((Math.random() * 20) + 1);
    };
}