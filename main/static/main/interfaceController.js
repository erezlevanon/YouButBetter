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
    this.CODE_LENGTH = 100;
    this.CODE_HEIGHT = 10;

    this.traitCodes = [];


    this.initTraitCodes = () => {
        for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {
            if (i === 4) {
                this.chosenTraits.push({title: 'High risk of cancer', price: -25000, sale_price: -25000})
            }
            this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            this.traitCodes.push(this.getTraitCode());
        }

    };

    this.toggleTrait = (name, price, sale_price) => {
        if (!this.isTraitChosen(name)) {
            let new_index = this.randInt(5, 20);
            this.chosenTraits.splice(new_index, 0, {title: name, price: price, sale_price: sale_price});
            this.traitCodes.splice(new_index, 0, this.getTraitCode(name));
            this.curPrice += price;
            this.curSalePrice += sale_price;
        } else if (name !== '') {
            let index = this.chosenTraits.indexOf(this.chosenTraits.find((val) => val.title === name));
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.traitCodes.splice(index, 1);
                this.curPrice -= price;
                this.curSalePrice -= sale_price;
            }

        }
    };

    this.getTraitCode = (name) => {
        const total_width = 100;
        let start_pos = 0;
        let width = this.randInt(1, 15);
        let res = [];
        while (start_pos < total_width) {
            if (start_pos < total_width)
                res.push({x:start_pos, w:width});
            start_pos += width + 1;
            width = Math.min(this.randInt(1, 15), total_width-start_pos);
        }
        return res;
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

    this.randInt = (min, max) => {
        return Math.floor((Math.random() * max + 1) + min);
    };

    this.getTraitViewPortSize = () => {
        return "0 0 " + this.CODE_LENGTH + " " + this.CODE_HEIGHT;
    };

    this.initTraitCodes();
}