/**
 * Controller for the interface.
 * @param $scope
 * @param $http
 */
class interfaceController {
    constructor($scope, $http) {
        this._scope = $scope;
        this._http = $http;

        this.curPrice = 0;
        this.curSalePrice = 0;
        this.chosenTraits = [];

        this.DEFAULT_NUMBER_OF_TRAITS = 34;
        this.CODE_LENGTH = 100;
        this.CODE_HEIGHT = 10;
        this.NUM_OF_GIFS = 100;

        this.segmentAnimations = [];

        this.skipIntroAnimation = false;

        this.showIntroAnim = true;
        this.showLoadingAnim = false;
        this.showDoneAnimation = false;

        this.introAnimation = null;
        this.loadingAnimation = null;

        this.initTraitCodes();
        this.initAnimations();

        this.stats = this.getRandomStats();
    }

    initTraitCodes() {
        for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {
            if (i === 4) {
                this.chosenTraits.push({title: 'High risk of cancer', price: -25000, sale_price: -25000})
            } else {
                this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            }
            this.segmentAnimations.push(this.getGifSrc(i));
        }
    };

    toggleTrait(name, price, sale_price) {
        if (!this.isTraitChosen(name)) {
            let new_index = this.randInt(5, 20);
            this.chosenTraits.splice(new_index, 0, {title: name, price: price, sale_price: sale_price});
            this.segmentAnimations.splice(new_index, 0, this.getGifSrc());
            this.curPrice += price;
            this.curSalePrice += sale_price;
        } else if (name !== '') {
            let index = this.chosenTraits.indexOf(this.chosenTraits.find((val) => val.title === name));
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.segmentAnimations.splice(index, 1);
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
        if (this.loadingAnimation) {
            this.showLoadingAnim = true;
            this.loadingAnimation.play();
        }
        this._http.post('/produce', data).then(
            () => {
                this.loadingAnimation.stop();
                this.showLoadingAnim = false;
                this.showDoneAnimation = true;
                this.doneAnimation.play();
                // TODO: deal with successful production.
            }
        );
    };

    getGifSrc(index) {
        if (!index && index !== 0) {
            index = this.randInt(this.DEFAULT_NUMBER_OF_TRAITS + 1, this.NUM_OF_GIFS)
        }
        return '/static/main/segments/segment_' + index + '.gif'
    }

    initAnimations() {
        lottie.searchAnimations();
        this.introAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'intro');
        this.loadingAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'loading');
        this.doneAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'done');

        if (this.introAnimation) {
            this.introAnimation.addEventListener('complete', $.proxy(() => {
                this.introAnimation.stop();
                this.showIntroAnim = false;
                this._scope.$apply();
            }));
            this.introAnimation.play();
        }
    }

    gaussRandInt(min, max, skew) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
        num = Math.pow(num, skew); // Skew
        num *= max - min; // Stretch to fill range
        num += min; // offset to min
        return Math.floor(num);
    }

    getRandomStats() {
        return {
            intelligence: {
                name: 'intelligence',
                value: this.randInt(51, 98),
                positive: this.randInt(0,2) === 0,
            },
            height: {
                name: 'potential height',
                value: this.gaussRandInt(110, 250, 1),
            },
            weight: {
                name: 'weight',
                value: this.randInt(5, 30),
                positive: this.randInt(0,2) === 0,
            },
            emotional: {
                name: "Emotional Intelligence",
                value: this.randInt(51, 98),
                positive: this.randInt(0,2) === 0,
            },
            life_expectancy: {
                name: "Life Expectancy",
                value: this.gaussRandInt(30, 150, 1),
            }
        };
    }

    getLocForStat(name) {
        let intelligence_loc = 0;
        if (this.stats[name].positive) {
            intelligence_loc = this.stats[name].value;
        } else {
            intelligence_loc = 100 - this.stats[name].intelligence.value;
        }
        return intelligence_loc * 1.5;
    }
}