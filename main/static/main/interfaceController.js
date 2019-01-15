/**
 * Controller for the interface.
 * @param $scope
 * @param $http
 */
class interfaceController {
    constructor($scope, $http) {
        console.log('init');
        this._scope = $scope;
        this._http = $http;
        this.curPrice = 0;
        this.curSalePrice = 0;
        this.chosenTraits = [];

        this.DEFAULT_NUMBER_OF_TRAITS = 32;
        this.CODE_LENGTH = 100;
        this.CODE_HEIGHT = 10;

        this.traitCodes = [];
        this.traitAnimationAttributes = [];

        this.skipIntroAnimation = false;
        this.skipOutroAnimation = false;
        this.showIntroAnim = true;
        this.showOutroAnim = true;

        this.initTraitCodes();
        this.initAnimations();
    }

    initTraitCodes() {
        for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {
            if (i === 4) {
                this.chosenTraits.push({title: 'High risk of cancer', price: -25000, sale_price: -25000})
            } else {
                this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            }
            this.traitCodes.push(this.getTraitCode());
            this.traitAnimationAttributes.push(this.getRowRandomAnimationAttr(this.traitCodes[i].length));
        }

    };

    toggleTrait(name, price, sale_price) {
        if (!this.isTraitChosen(name)) {
            let new_index = this.randInt(5, 20);
            this.chosenTraits.splice(new_index, 0, {title: name, price: price, sale_price: sale_price});
            this.traitCodes.splice(new_index, 0, this.getTraitCode(name));
            this.traitAnimationAttributes.splice(new_index, 0, this.getRowRandomAnimationAttr(this.traitCodes[new_index].length));
            this.curPrice += price;
            this.curSalePrice += sale_price;
        } else if (name !== '') {
            let index = this.chosenTraits.indexOf(this.chosenTraits.find((val) => val.title === name));
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.traitCodes.splice(index, 1);
                this.traitAnimationAttributes.splice(index, 1);
                this.curPrice -= price;
                this.curSalePrice -= sale_price;
            }

        }
    };

    getTraitCode(name) {
        const total_width = 100;
        const min_width = 1;
        const max_width = 10;
        let start_pos = 0;
        let width = this.randInt(min_width, max_width);
        let res = [];
        while (start_pos < total_width) {
            if (start_pos < total_width)
                res.push({x: start_pos, w: width});
            // start_pos += width + 1;
            start_pos += width;
            width = Math.min(this.randInt(min_width, max_width), total_width - start_pos);
        }
        return res;
    };


    isTraitChosen(name) {
        return this.chosenTraits.some((existing) => existing.title === name)
    };

    currentPriceFormatted() {
        return this.curPrice;
    };

    currentSalePriceFormatted() {
        return this.curSalePrice;
    };

    // min inclusive, max exclusive.
    randInt(min, max) {
        return Math.floor((Math.random() * (max - min)) + min);
    };

    getTraitViewPortSize() {
        return '0 0 ' + this.CODE_LENGTH + ' ' + this.CODE_HEIGHT;
    };

    getRandomAnimationAttr() {
        return {
            dur: this.getRandomAnimationDuration(),
            delay: this.getRandomAnimationDelay(),
            show: this.randInt(0, 2) === 0,
        };
    };

    getRandomAnimationDuration() {
        return (this.randInt(1, 3) * 8 + this.randInt(0, 5)) + 's';
    };

    getRandomAnimationDelay() {
        return this.randInt(2, 6) + 's';
    };

    getRowRandomAnimationAttr(size) {
        let res = [];
        for (let i = 0; i < size; i++) {
            res.push(this.getRandomAnimationAttr());
        }
        return res;
    };

    produce() {
        let data = {};
        let config = {
            xsrfHeaderName: 'X-CSRFToken',
            xsrfCookieName: 'csrftoken',
        };
        this._http.post('/produce', data, config).then(
            () => {
                // TODO: deal with successful production.
            }
        );
    };

    initAnimations() {
        lottie.searchAnimations();
        this.introAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'intro');
        console.log(lottie.getRegisteredAnimations());
        console.log(this.introAnimation);
        this.outroAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'ending');

        if (this.introAnimation) {
            this.introAnimation.addEventListener('complete', $.proxy(() => {
                console.log('fdsa');
                this.introAnimation.destroy();
                this.showIntroAnim = false;
                this._scope.$apply();
            }));
        }
        this.introAnimation.play();
    }
}