/**
 * Controller for the interface.
 * @param $scope
 * @param $http
 */
class interfaceController {
    constructor($scope, $http, $mdDialog) {
        this._scope = $scope;
        this._http = $http;
        this._mdDialog = $mdDialog;

        this.curPrice = 0;
        this.curSalePrice = 0;
        this.chosenTraits = [];

        this.DEFAULT_NUMBER_OF_TRAITS = 34;
        this.CODE_LENGTH = 100;
        this.CODE_HEIGHT = 10;
        this.NUM_OF_GIFS = 100;

        this.segmentAnimations = [];

        this.skipIntroAnimation = true;

        this.showIntroAnim = true;
        this.showLoadingAnim = false;
        this.showDoneAnimation = false;

        this.introAnimation = null;
        this.loadingAnimation = null;

        this.stats = this.getRandomStats();
        this.initTraitCodes();
        this.initAnimations();
    }

    initTraitCodes() {
        for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {
            if (POSSIBLE_DIAGNOSED_TRAITS.length > 0 &&
                interfaceController.randInt(0, this.DEFAULT_NUMBER_OF_TRAITS * 0.7) === 0) {
                let trait_index = interfaceController.randInt(0, POSSIBLE_DIAGNOSED_TRAITS.length);
                let trait = POSSIBLE_DIAGNOSED_TRAITS[trait_index];
                POSSIBLE_DIAGNOSED_TRAITS.splice(trait_index, 1);
                this.chosenTraits.push(trait);
                this.updateStatsFromTrait(trait);
                this.segmentAnimations.push(this.getGifSrc(i));
            }
            this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            this.segmentAnimations.push(this.getGifSrc(i));
        }
    };

    toggleTrait(name, price, sale_price, effect, effect_val, effect_absolute) {
        if (!this.isTraitChosen(name)) {
            let new_index = interfaceController.randInt(5, 20);
            let trait = {
                    title: name,
                    price: price,
                    sale_price: sale_price,
                    effect: effect,
                    effect_val: effect_val,
                    effect_absolute: effect_absolute,
                };
            console.log(effect);
            console.log(effect_val);
            this.chosenTraits.splice(new_index, 0, trait);
            this.segmentAnimations.splice(new_index, 0, this.getGifSrc());
            this.curPrice += price;
            this.curSalePrice += sale_price;
            this.updateStatsFromTrait(trait, false);
        } else if (name !== '') {
            let trait = this.chosenTraits.find((val) => val.title === name);
            let index = this.chosenTraits.indexOf(trait);
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.segmentAnimations.splice(index, 1);
                this.curPrice -= price;
                this.curSalePrice -= sale_price;
                this.updateStatsFromTrait(trait, true)
            }

        }
    };

    updateStatsFromTrait(trait, isRemoved) {
        let sign = isRemoved ? -1 : 1;
        let stat = this.stats[trait.effect];
        if (stat) {
            if (trait.effect_absolute) {
                if (isRemoved) {
                    console.log(stat);
                    let index  = stat.history.indexOf(trait.effect_val);
                    console.log(index);
                    if (index !== -1 ) stat.history.splice(index, 1);
                    console.log(stat);
                    stat.value = stat.history[stat.history.length-1];
                } else {
                    stat.history.push(stat.value);
                    stat.value = trait.effect_val;
                }
            } else {
                this.stats[trait.effect].value += sign * trait.effect_val;
            }
        }
    }


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
    static randInt(min, max) {
        return Math.floor((Math.random() * (max - min)) + min);
    };

    getTraitViewPortSize() {
        return '0 0 ' + this.CODE_LENGTH + ' ' + this.CODE_HEIGHT;
    };

    getRandomAnimationAttr() {
        return {
            dur: this.getRandomAnimationDuration(),
            delay: this.getRandomAnimationDelay(),
            show: interfaceController.randInt(0, 2) === 0,
        };
    };

    getRandomAnimationDuration() {
        return (interfaceController.randInt(1, 3) * 8 + interfaceController.randInt(0, 5)) + 's';
    };

    getRandomAnimationDelay() {
        return interfaceController.randInt(2, 6) + 's';
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
            index = interfaceController.randInt(this.DEFAULT_NUMBER_OF_TRAITS + 1, this.NUM_OF_GIFS)
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
                value: interfaceController.randInt(3, 98),
                history: [],
            },
            height: {
                value: this.gaussRandInt(110, 250, 1),
                history: [],
            },
            weight: {
                value: interfaceController.randInt(20, 81),
                history: [],
            },
            emotional: {
                value: interfaceController.randInt(3, 98),
                history: [],
            },
            life_expectancy: {
                value: this.gaussRandInt(30, 150, 1),
                history: [],
            }
        };
    }

    isStatPositive (name) {
        return this.stats[name].value > 50;
    }

    getStateValInRange (name) {
        let val = this.stats[name].value;
        if (name === 'weight') {
            return this.isStatPositive(name) ? val - 50 : 50 - val;
        } else {
            return this.isStatPositive(name) ? val : 100 - val;
        }
    }

    getLocForStat(name) {
        let loc = 0;
        let stat = this.stats[name];
        if (!stat) return 75;
        if (name === 'height') {
            let val = Math.min(210, stat.value);
            return ((val - 130) / (210 - 130)) * 150;
        } else if (name === 'life_expectancy') {
            let val = Math.min(140, stat.value);
            return ((val - 30) / (140 - 30)) * 150;
        }
        loc = stat.value;
        return loc * 1.5;
    }

    showIssueTraitDialog(trait) {
        let alert = this._mdDialog.confirm({
            title: trait.title,
            textContent: trait.description,
            ok: 'Remove this risk',
            cancel: 'Leave this risk',
            width: '30',
        });
        this._mdDialog
            .show(alert).then((a) => {
            this.toggleTrait(trait.title, trait.price, trait.price);
        })
            .catch((c) => {
            })
            .finally(function () {
                alert = undefined;
            });
    }

    showPurchasedTraitDialog(trait) {
        console.log('purchased');
    }

    showTraitDialog(trait) {
        if (trait.title !== '') {
            console.log();
            if (trait.price < 0) {
                this.showIssueTraitDialog(trait)
            } else {
                this.showPurchasedTraitDialog(trait)
            }
        }
    }
}

function getDescriptionForDiagnosedTrait (title, price) {
    return 'Unfortunately diagnosis shows genes variants linked to high risk of ' + title.toUpperCase() + '. ' +
            'You can choose to edit these variants and lower the risk of your child having to deal with it. ' +
            'This operation costs ' + price.toLocaleString('en-US') + ' Euros.'
}

let POSSIBLE_DIAGNOSED_TRAITS = [
    {
        title: 'Lung Cancer',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('lung cancer', 250000),
        price: -250000,
        effect: 'life_expectancy',
        effect_val: -11,
    },

    {
        title: 'Breast Cancer',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Breast Cancer', 300000),
        price: -300000,
        effect: 'life_expectancy',
        effect_val: -14,
    },

    {
        title: 'Parkinson\'s desease',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Parkinson\'s desease', 625000),
        price: -625000,
        effect: 'life_expectancy',
        effect_val: -2,
    },

    {
        title: 'Cystic Fibrosis',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Cystic Fibrosis', 750000),
        price: -250000,
        effect: 'life_expectancy',
        effect_val: 35,
        effect_absolute: true,
    },

    {
        title: 'Dwarfism',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Dwarfism', 12500),
        price: -12500,
        effect: 'height',
        effect_val: 130 + interfaceController.randInt(-10, 11),
        effect_absolute: true,
    },

    {
        title: 'Lactose Intolerance',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Lactose Intolerance', 30500),
        price: -30500,
        effect: 'life_expectancy',
        effect_val: -2,
    },

    {
        title: 'Celiac disease',
        topic: 'health',
        description: getDescriptionForDiagnosedTrait('Lactose Intolerance', 37200),
        price: -37500,
        effect: 'life_expectancy',
        effect_val: -5,
    },

];