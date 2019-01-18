/**
 * Controller for the interface.
 * @param $scope
 * @param $http
 */
class interfaceController {
    constructor($scope, $http, $mdDialog, $window) {
        this._scope = $scope;
        this._http = $http;
        this._mdDialog = $mdDialog;
        this._window = $window;

        this.curPrice = 0;
        this.curSalePrice = 0;
        this.chosenTraits = [];

        this.statsConstants = {
            intelligence: {
                min: 3,
                max: 98,
            },
            height: {
                min: 100,
                max: 250,
            },
            weight: {
                min: 20,
                max: 81,
            },
            emotional: {
                min: 3,
                max: 98,
            },
            life_expectancy: {
                min: 30,
                max: 150,
            },
        };

        this.DEFAULT_NUMBER_OF_TRAITS = 32;
        this.CODE_LENGTH = 100;
        this.CODE_HEIGHT = 10;
        this.NUM_OF_GIFS = 100;
        this.gifsIndexOffset = interfaceController.randInt(0, this.NUM_OF_GIFS);

        this.segmentAnimations = [];

        this.skipIntroAnimation = false;

        this.showIntroAnim = true;
        this.showPreIntroStart = true;
        this.showPreIntroWait = false;
        this.showIntroFinal = false;
        this.showLoadingAnim = false;
        this.showDoneAnimation = false;

        this.introAnimation = null;
        this.loadingAnimation = null;

        this.allowClickReload = false;

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
                this.insertTrait(trait);
                this.segmentAnimations.push(this.getGifSrc());
            }
            this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            this.segmentAnimations.push(this.getGifSrc(i));
        }
    };

    toggleTrait(name, price, sale_price, effect, effect_val, effect_absolute, company) {
        if (!this.isTraitChosen(name)) {
            let trait = {
                title: name,
                price: price,
                sale_price: sale_price,
                effect: effect,
                effect_val: effect_val,
                effect_absolute: effect_absolute,
                company: company,
            };
            this.insertTrait(trait);
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

    insertTrait(trait) {
        if (trait.price > 0) {
            this.curPrice += trait.price;
            this.curSalePrice += trait.sale_price;
        }
        let new_index = Math.min(interfaceController.randInt(5, 25), this.chosenTraits.length - 1);
        this.chosenTraits.splice(new_index, 0, trait);
        this.segmentAnimations.splice(new_index, 0, this.getGifSrc());
        this.updateStatsFromTrait(trait);
    }

    updateStatsFromTrait(trait, isRemoved) {
        let sign = isRemoved ? -1 : 1;
        let stat = this.stats[trait.effect];
        if (stat) {
            if (trait.effect_absolute) {
                if (isRemoved) {
                    let index = stat.history.indexOf(trait.effect_val);
                    if (index !== -1) stat.history.splice(index, 1);
                    stat.value = stat.history[stat.history.length - 1];
                } else {
                    stat.history.push(stat.value);
                    stat.value = trait.effect_val;
                }
            } else {
                this.protectedAddToStatVal(trait.effect, sign * trait.effect_val);
            }
        }
    }

    protectedAddToStatVal(name, delta) {
        let statConst = this.statsConstants[name];
        let stat = this.stats[name];
        if (stat && statConst) {
            let rawVal = stat.value + delta;
            stat.value = Math.min(Math.max(rawVal, statConst.min), statConst.max);
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
        index = (index + this.gifsIndexOffset) % this.NUM_OF_GIFS;
        return '/static/main/segments/segment_' + index + '.gif'
    }

    initAnimations() {
        lottie.searchAnimations();
        this.preIntroStartAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'pre_intro_start');
        this.preIntroWaitAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'pre_intro_waiting');
        this.introAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'intro');
        this.loadingAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'loading');
        this.doneAnimation = lottie.getRegisteredAnimations().find((anim) => anim.name === 'done');

        if (this.preIntroStartAnimation && this.preIntroWaitAnimation) {
            this.showPreIntroStart = true;
            this.preIntroStartAnimation.addEventListener('complete', $.proxy(() => {
                this.preIntroStartAnimation.stop();
                this.showPreIntroStart = false;
                this.showPreIntroWait = true;
                this.preIntroWaitAnimation.play();
                this._scope.$apply();
            }));
            this.preIntroStartAnimation.play();
        }

        if (this.introAnimation) {
            this.introAnimation.addEventListener('complete', $.proxy(() => {
                this.introAnimation.stop();
                this.showIntroAnim = false;
                this._scope.$apply();
            }));
        }

        if (this.doneAnimation) {
            this.doneAnimation.addEventListener('complete', $.proxy(() => {
                this.allowClickReload = true;
                this._scope.$apply();
            }));
        }
    }

    clickOnWaitingAnimation() {
        this.preIntroWaitAnimation.stop();
        this.showPreIntroWait = false;
        this.showIntroFinal = true;
        this.introAnimation.play();
    }

    clickReloadIfAllowed() {
        if (this.allowClickReload) {
            this._window.location.reload();
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

    presentableTrait(traitName) {
        let wantedLength = 16;
        let ending = '...';
        return traitName.length > wantedLength ? traitName.substr(0, wantedLength - ending.length) + ending : traitName;
    }

    getRandomStats() {
        let intelligence = this.statsConstants.intelligence;
        let height = this.statsConstants.height;
        let weight = this.statsConstants.weight;
        let emotional = this.statsConstants.emotional;
        let life_expectancy = this.statsConstants.life_expectancy;
        return {
            intelligence: {
                value: interfaceController.randInt(intelligence.min, intelligence.max),
                history: [],
                dialogTitle: 'Intelligence Diagnosis',
                dialogText: 'This is a calculated estimation of your future child\'s intelligence (IQ) ' +
                    'compared to the rest of the population and predicted population. You can effect this number ' +
                    'by purchasing traits from the INTELLIGENCE category. ' +
                    '*all actual traits may be effected by environmental variables.',
            },
            height: {
                value: this.gaussRandInt(height.min, height.max, 1),
                history: [],
                dialogTitle: 'Height Diagnosis',
                dialogText: 'This is a calculated estimation of your future child\'s potential height. ' +
                    'You can effect this number ' +
                    'by purchasing some of the traits from the PHYSICAL and HEALTH categories. ' +
                    '*all actual traits may be effected by environmental variables.',
            },
            weight: {
                value: interfaceController.randInt(weight.min, weight.max),
                history: [],
                dialogTitle: 'Weight Tendencies Diagnosis',
                dialogText: 'This is a calculated estimation of your future child\'s weight ' +
                    'compared to the average predicted weight of population. You can effect this number ' +
                    'by purchasing some of the traits from the PHYSICAL, HEALTH and AESTHETICS categories. ' +
                    '*all actual traits may be effected by environmental variables.',
            },
            emotional: {
                value: interfaceController.randInt(emotional.min, emotional.max),
                history: [],
                dialogTitle: 'Emotional Intelligence Diagnosis',
                dialogText: 'This is a calculated estimation of your future child\'s emotional intelligence (EQ) ' +
                    'compared to the rest of the population and predicted population. You can effect this number ' +
                    'by purchasing traits from the EMOTIONAL and RELATIONSHIP category. ' +
                    '*all actual traits may be effected by environmental variables.',
            },
            life_expectancy: {
                value: this.gaussRandInt(life_expectancy.min, life_expectancy.max, 1),
                history: [],
                dialogTitle: 'Life Expectancy Diagnosis',
                dialogText: 'This is a statistical estimation of your future child\'s life expectancy based on ' +
                    'known genetic diseases and statistical analysis of the population.' +
                    'You can effect this number ' +
                    'by purchasing some of the traits the All of the categories. ' +
                    '*all actual traits may be effected by environmental variables.',
            },
        };
    }

    isStatPositive(name) {
        return this.stats[name].value > 50;
    }

    getStateValInRange(name) {
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
            return ((val - 120) / (210 - 120)) * 150;
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
        });
        this._mdDialog
            .show(alert).then(() => {
            this.toggleTrait(trait.title, trait.price, trait.price);
        })
            .catch(() => {
            })
            .finally(function () {
                alert = undefined;
            });
    }

    showStatAlert(name) {
        let stat = this.stats[name];
        if (stat) {
            let alert = this._mdDialog.alert({
                title: stat.dialogTitle,
                textContent: stat.dialogText,
                ok: 'Got it',
            });
            this._mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }
    }


    getPurchasedTraitDescription(trait) {
        let res = 'Gene variants related to ' + trait.title +
            ' created by ' + trait.company + '.';
        if (trait.sale_price !== trait.price) {
            res += ' This trait usually goes for ' + trait.price.toLocaleString('en-US') +
                ' Euros But is now on sale for only ' + trait.sale_price.toLocaleString('en-US') +
                ' Euros thanks to the good people at ' + trait.company + '.';
        }
        return res;
    }

    showPurchasedTraitDialog(trait) {
        let alert = this._mdDialog.confirm({
            title: trait.title,
            textContent: this.getPurchasedTraitDescription(trait),
            ok: 'Great',
            cancel: 'Remove',
        });
        this._mdDialog
            .show(alert).then(() => {
        })
            .catch(() => {
                this.toggleTrait(trait.title, trait.price, trait.price);
            })
            .finally(function () {
                alert = undefined;
            });
    }

    showTraitDialog(trait) {
        if (trait.title !== '') {
            if (trait.price < 0) {
                this.showIssueTraitDialog(trait)
            } else {
                this.showPurchasedTraitDialog(trait)
            }
        }
    }
}

function getDescriptionForDiagnosedTrait(title, price) {
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