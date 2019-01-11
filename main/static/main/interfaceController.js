/**
 * Controller for the interface.
 * @param $scope
 */
function interfaceController($scope) {
    this.scope = $scope;
    this.curPrice = 0;
    this.curSalePrice = 0;
    this.chosenTraits = [];
    this.traitToPrice = new Map();
    this.traitToSalePrice = new Map();

    this.BINARY_CODE_LENGTH = 100;


    this.toggleTrait = (name, price, sale_price) => {

        // This mess is because i don't have the actual data accessible to angularjs, only to django.
        // in hindsight I would have not use the django templates but expose a api to get this data. If i'll have
        // to much available time i'll do it later.
        // TODO(use API to get data from server and give up on django models)
        if (!!price) {
            this.traitToPrice.set(name, price);
        }
        if (!!sale_price) {
            this.traitToSalePrice.set(name, sale_price);
        }
        if (!this.isTraitChosen(name)) {
            this.chosenTraits.push(name);
            this.curPrice += price;
            this.curSalePrice += sale_price;
        } else {
            let index = this.chosenTraits.indexOf(name);
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.curPrice -= this.traitToPrice.get(name);
                this.curSalePrice -= this.traitToSalePrice.get(name);
            }

        }
    };

    this.isTraitChosen = (name) => {
        return this.chosenTraits.some((existing) => existing === name)
    };

    this.currentPriceFormatted = () => {
        return this.curPrice;
    };

    this.currentSalePriceFormatted = () => {
        return this.curSalePrice;
    };

    this.traitToBinary = (name) => {
        let output = '';
        let length_diff = this.BINARY_CODE_LENGTH - name.length;
        if (length_diff > 0) {
            name += '0'.repeat(this.BINARY_CODE_LENGTH);
        }
        name = name.substr(0, this.BINARY_CODE_LENGTH);
        for (let i = 0 ; i < name.length; i++) {
            output += name.charCodeAt(i).toString(2);
        }
        return output.substr(0, 28);
    }
}