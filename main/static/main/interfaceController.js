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
        this.chosenSales = [];

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

        this.forCheckout = new Map();

        this.DEFAULT_NUMBER_OF_TRAITS = 32;
        this.CODE_LENGTH = 100;
        this.CODE_HEIGHT = 10;
        this.NUM_OF_GIFS = 60;
        this.gifsIndexOffset = interfaceController.randInt(0, this.NUM_OF_GIFS);

        this.segmentAnimations = [];

        this.showSkip = true;

        this.showIntroAnim = true;
        this.showPreIntroStart = true;
        this.showPreIntroWait = false;
        this.showIntroFinal = false;
        this.showLoadingAnim = false;
        this.showDoneAnimation = false;
        this.showInstructionsSample = false;
        this.showInstructionsSampleWait = false;
        this.showInstructionsTube = false;
        this.showInstructionsTubeWait = false;
        this.showInstructionsOver = false;

        this.introAnimation = null;
        this.loadingAnimation = null;

        this.allowClickReload = false;

        this.stats = this.getRandomStats();
        this.initTraitCodes();
        this.initAnimations();
    }

    initTraitCodes() {
        for (let i = 0; i < this.DEFAULT_NUMBER_OF_TRAITS; i++) {

            this.chosenTraits.push({title: '', price: 0, sale_price: 0});
            this.segmentAnimations.push(this.getGifSrc(i, false, false));
        }
        this.getNonRepeatingRandomFromList(
            this.gaussRandInt(0, 5, 1),
            POSSIBLE_DIAGNOSED_TRAITS)
            .forEach(
                (trait) => {
                    this.insertTrait(trait, true);
                    this.updateShoppingBasket(trait, true, false);
                }
            );
    };

    toggleTrait(name, price, sale_price, effect, effect_val, effect_absolute, company, topic) {
        if (!this.isTraitChosen(name)) {
            let trait = {
                title: name,
                price: price,
                sale_price: sale_price,
                topic: topic,
                effect: effect,
                effect_val: effect_val,
                effect_absolute: effect_absolute,
                company: company,
            };
            this.insertTrait(trait, false);
            this.updateShoppingBasket(trait, false, false)
        } else if (name !== '') {
            let trait = this.chosenTraits.find((val) => val.title === name);
            let index = this.chosenTraits.indexOf(trait);
            if (index !== -1) {
                this.chosenTraits.splice(index, 1);
                this.segmentAnimations.splice(index, 1);
                this.curPrice -= price;
                this.curSalePrice -= sale_price;
                this.updateStatsFromTrait(trait, true);
                this.updateShoppingBasket(trait, price < 0, true);
            }

        }
    };

    insertTrait(trait, isBad) {
        if (trait.price > 0) {
            this.curPrice += trait.price;
            this.curSalePrice += trait.sale_price;
        }
        let new_index = Math.min(interfaceController.randInt(2, 23), this.chosenTraits.length - 1);
        this.chosenTraits.splice(new_index, 0, trait);
        this.segmentAnimations.splice(new_index, 0, this.getGifSrc(-1, true, isBad));
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

    updateShoppingBasket(trait, isBad, isRemoved) {
        if (isBad) isRemoved = !isRemoved;
        let topicList = this.forCheckout.get(trait.topic);
        if (!topicList && !isRemoved) {
            topicList = this.forCheckout.set(trait.topic, []).get(trait.topic);
        }
        if (topicList) {
            if (isRemoved) {
                let index = this.forCheckout.get(trait.topic).indexOf(trait);
                topicList.splice(index, 1);
                if (topicList.length === 0) {
                    this.forCheckout.delete(trait.topic);
                }
            } else {
                topicList.push(trait);
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

    getNonRepeatingRandomFromList(num, list) {
        list = list.map((item) => item); // shallow copy list.
        let res = [];
        for (let i = 0; i < num; i++) {
            let rand_index = interfaceController.randInt(0, list.length);
            let rand_item = list[rand_index];
            list.splice(rand_index, 1);
            res.push(rand_item);
        }
        return res;
    }

    getRemainingConditions() {
        return this.chosenTraits.filter(
            (trait) => trait.sale_price < 0
        ).map(
            (trait) => trait.title
        )
    }

    checkout() {
        let checkoutDialog = this._mdDialog.confirm({
            templateUrl: '/static/main/dialogs/checkout.html',
            controllerAs: 'dialog',
            locals: {
                topics: Array.from(this.forCheckout),
                price: this.curSalePrice,
                done: () => {
                    this._mdDialog.hide();
                },
                cancel: () => {
                    this._mdDialog.cancel();
                },
            },
        });
        let salesDialog = this._mdDialog.confirm({
            templateUrl: '/static/main/dialogs/sales.html',
            controllerAs: 'dialog',
            locals: {
                sales: this.getNonRepeatingRandomFromList(4, POSSIBLE_SALES),
                price: () => this.curSalePrice,
                update: (sale, isActivated) => this.updatePriceWithSale(sale, isActivated),
                done: () => {
                    this._mdDialog.hide();
                },
                cancel: () => {
                    this._mdDialog.cancel();
                },
            },
        });
        this._mdDialog
            .show(checkoutDialog).then(() => {
            let conditions = this.getRemainingConditions();
            if (conditions.length > 0) {
                let conditionDialog = this._mdDialog.confirm({
                    templateUrl: '/static/main/dialogs/still_issues.html',
                    controllerAs: 'dialog',
                    locals: {
                        conditions: conditions,
                        done: () => {
                            this._mdDialog.hide();
                        },
                        cancel: () => {
                            this._mdDialog.cancel();
                        },
                    },
                });
                this._mdDialog.show(conditionDialog).then(
                    () => {
                        this._mdDialog.show(salesDialog).then(
                            () => {
                                // TODO: think about updating data
                                this.produce();
                            }
                        ).catch(
                            () => {
                            }
                        ).finally(
                            () => {
                                salesDialog = undefined
                            }
                        );
                    }
                ).catch(() => {

                }).finally(() => {
                    conditionDialog = undefined
                });
            }
            else {
                this._mdDialog.show(salesDialog).then(
                    () => {
                        // TODO: think about updating data
                        this.produce();
                    }
                ).catch(
                    () => {
                    }
                ).finally(
                    () => {
                        salesDialog = undefined
                    }
                );
            }
        })
            .catch(() => {
            })
            .finally(function () {
                checkoutDialog = undefined;
            });
    }

    produce() {
        if (this.loadingAnimation) {
            this.showLoadingAnim = true;
            this.loadingAnimation.play();
        }
        this._http.post('/produce', {}).then(
            () => {
                this.loadingAnimation.stop();
                this.showLoadingAnim = false;
                this.showDoneAnimation = true;
                this.doneAnimation.play();
                // TODO: deal with successful production.
            }
        );
    };

    getGifSrc(index, special, bad) {
        if (index === -1) {
            index = interfaceController.randInt(0, this.NUM_OF_GIFS)
        }
        index = (index + this.gifsIndexOffset) % this.NUM_OF_GIFS;

        let path = '/static/main/';

        if (special) {
            if (bad) {
                path += 'red_segments';
            } else {
                path += 'colored_segments';
            }
        } else {
            path += 'segments';
        }

        return path + '/segment_' + index + '.gif'
    }

    initAnimations() {
        lottie.searchAnimations();
        let animations = lottie.getRegisteredAnimations();
        this.preIntroStartAnimation = animations.find((anim) => anim.name === 'pre_intro_start');
        this.preIntroWaitAnimation = animations.find((anim) => anim.name === 'pre_intro_waiting');
        this.introAnimation = animations.find((anim) => anim.name === 'intro');

        this.instructionsSample = animations.find((anim) => anim.name === 'instruction_sample');
        this.instructionsSampleWait = animations.find((anim) => anim.name === 'instruction_sample_wait');

        this.instructionsTube = animations.find((anim) => anim.name === 'instruction_tube');
        this.instructionsTubeWait = animations.find((anim) => anim.name === 'instruction_tube_wait');
        this.instructionsOver = animations.find((anim) => anim.name === 'instruction_over');

        this.loadingAnimation = animations.find((anim) => anim.name === 'loading');
        this.doneAnimation = animations.find((anim) => anim.name === 'done');

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
                this.showIntroFinal = false;
                this.showInstructionsTube = true;
                this.instructionsTube.play();
                this._scope.$apply();
            }));
        }

        if (this.instructionsSample) {
            this.instructionsSample.addEventListener('complete', $.proxy(() => {
                this.instructionsSample.stop();
                this.showInstructionsSample = false;
                this.showInstructionsSampleWait = true;
                this.instructionsSampleWait.play();
                this._scope.$apply();
                this._http.post('/read_samples', {}).then(
                    () => {
                        this.instructionsSampleWait.stop();
                        this.showInstructionsSampleWait = false;
                        this.showInstructionsOver = true;
                        this.instructionsOver.play();
                    }
                );
            }));
        }

        if (this.instructionsTube) {
            this.instructionsTube.addEventListener('complete', $.proxy(() => {
                this.instructionsTube.stop();
                this.showInstructionsTube = false;
                this.showInstructionsTubeWait = true;
                this.instructionsTubeWait.play();
                this._scope.$apply();
                this._http.post('/read_tube', {}).then(
                    () => {
                        this.instructionsTubeWait.stop();
                        this.showInstructionsTubeWait = false;
                        this.showInstructionsSample = true;
                        this.instructionsSample.play();
                    }
                );
            }));
        }

        if (this.instructionsOver) {
            this.instructionsOver.addEventListener('complete', $.proxy(() => {
                this.skipIntroAnimations();
                this._scope.$apply();
            }));
        }


        if (this.doneAnimation) {
            this.doneAnimation.addEventListener('complete', $.proxy(() => {
                this._http.post('/read_tube_done', {}).then(
                    () => {
                        this._window.location.reload();
                    }
                );
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
        let wantedLength = 26;
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
                name: 'Intelligence',
                value: interfaceController.randInt(intelligence.min, intelligence.max),
                history: [],
                categories: [
                    'INTELLIGENCE',
                ],
            },
            height: {
                name: 'Height',
                value: this.gaussRandInt(height.min, height.max, 1),
                history: [],
                categories: [
                    'PHYSICALITY',
                ],
            },
            weight: {
                name: 'Weight',
                value: interfaceController.randInt(weight.min, weight.max),
                history: [],
                categories: [
                    'HEALTH',
                    'AESTHETICS',
                    'PHYSICALITY',
                ],
            },
            emotional: {
                name: 'Emotional Intelligence',
                value: interfaceController.randInt(emotional.min, emotional.max),
                history: [],
                categories: [
                    'EMOTIONAL',
                    'RELATIONSHIP',
                ],
            },
            life_expectancy: {
                name: 'Life Expectancy',
                value: this.gaussRandInt(life_expectancy.min, life_expectancy.max, 1),
                history: [],
                categories: [
                    'HEALTH',
                    'EMOTIONAL',
                ],
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

    updatePriceWithSale(sale, isActivated) {
        // There is a problem mixing absolute discounts with percentage discounts because it messes with
        // the order of operators.
        if (sale.is_percentage) {
            let newPriceFraction = 1 - (sale.discount / 100);
            if (isActivated) {
                this.curSalePrice *= newPriceFraction;
                this.chosenSales.push(sale.action + ' by ' + sale.company);
            } else {
                this.curSalePrice *= (1 / newPriceFraction);
                this.chosenSales.splice(this.chosenSales.indexOf(sale.action + ' by ' + sale.company), 1);
            }
        } else {
            if (isActivated) {
                if (sale.discount > this.curSalePrice) {
                    sale.discount = this.curSalePrice;
                }
                this.curSalePrice -= sale.discount;
                this.chosenSales.push(sale.action + ' by ' + sale.company);
            } else {
                this.curSalePrice += sale.discount;
                this.chosenSales.splice(this.chosenSales.indexOf(sale.action + ' by ' + sale.company), 1);
            }
        }
    }

    showIssueTraitDialog(trait) {
        let removeTrait = this._mdDialog.confirm({
            templateUrl: '/static/main/dialogs/remove_bad_trait.html',
            controllerAs: 'dialog',
            locals: {
                trait: trait,
                done: () => {
                    this._mdDialog.hide();
                },
                cancel: () => {
                    this._mdDialog.cancel();
                },
            },
        });
        this._mdDialog
            .show(removeTrait).then(() => {
            this.toggleTrait(trait.title, trait.price, trait.price);
        })
            .catch(() => {
            })
            .finally(function () {
                removeTrait = undefined;
            });
    }

    showStatAlert(name) {
        let stat = this.stats[name];
        if (stat) {
            let showTrait = this._mdDialog.alert({
            templateUrl: '/static/main/dialogs/stats_dialog.html',
            controllerAs: 'dialog',
            locals: {
                name: stat.name,
                categories: stat.categories,
                done: () => {
                    this._mdDialog.hide();
                },
            },
        });
        this._mdDialog
            .show(showTrait).then(() => {})
            .catch(() => {})
            .finally(function () {
                showTrait = undefined;
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
        let showTrait = this._mdDialog.confirm({
            templateUrl: '/static/main/dialogs/show_trait.html',
            controllerAs: 'dialog',
            locals: {
                trait: trait,
                done: () => {
                    this._mdDialog.hide();
                },
                cancel: () => {
                    this._mdDialog.cancel();
                },
            },
        });
        this._mdDialog
            .show(showTrait).then(() => {
            this.toggleTrait(trait.title, trait.price, trait.price);
        })
            .catch(() => {
            })
            .finally(function () {
                showTrait = undefined;
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

    skipIntroAnimations() {
        this.showSkip = false;
        this.showIntroAnim = false;
        this.showLoadingAnim = false;
        this.showPreIntroStart = false;
        this.showPreIntroWait = false;
        this.showInstructionsSample = false;
        this.showInstructionsSampleWait = false;
        this.showInstructionsTube = false;
        this.showInstructionsTubeWait = false;
        this.showInstructionsOver = false;
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
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('lung cancer', 250000),
        price: -250000,
        sale_price: -250000,
        effect: 'life_expectancy',
        effect_val: -11,
    },

    {
        title: 'Breast Cancer',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Breast Cancer', 300000),
        price: -300000,
        sale_price: -300000,
        effect: 'life_expectancy',
        effect_val: -14,
    },

    {
        title: 'Parkinson\'s disease',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Parkinson\'s desease', 625000),
        price: -625000,
        sale_price: -625000,
        effect: 'life_expectancy',
        effect_val: -2,
    },

    {
        title: 'Alzheimer\'s disease',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Alzheimer\'s disease', 712000),
        price: -712000,
        sale_price: -712000,
        effect: 'life_expectancy',
        effect_val: -13,
    },

        {
        title: 'dislike coriander',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('dislike coriander', 15000),
        price: -15000,
        sale_price: -15000,
        effect: 'weight',
        effect_val: -3,
    },

            {
        title: 'Bald at young age',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Bald at young age', 200000),
        price: -200000,
        sale_price: -200000,
        effect: 'none',
        effect_val: -3,
    },

                {
        title: 'Fear of height',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Bald at young age', 30000),
        price: -30000,
        sale_price: -30000,
        effect: 'life_expectancy',
        effect_val: 3,
    },


    {
        title: 'Cystic Fibrosis',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Cystic Fibrosis', 750000),
        price: -250000,
        sale_price: -250000,
        effect: 'life_expectancy',
        effect_val: 35,
        effect_absolute: true,
    },

    {
        title: 'Dwarfism',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Dwarfism', 12500),
        price: -12500,
        sale_price: -12500,
        effect: 'height',
        effect_val: 130 + interfaceController.randInt(-10, 11),
        effect_absolute: true,
    },

    {
        title: 'Lactose Intolerance',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Lactose Intolerance', 30500),
        price: -30500,
        sale_price: -30500,
        effect: 'life_expectancy',
        effect_val: -5,
    },

    {
        title: 'Celiac disease',
        topic: 'Fixed Issues',
        description: getDescriptionForDiagnosedTrait('Lactose Intolerance', 37200),
        price: -37500,
        sale_price: -37500,
        effect: 'life_expectancy',
        effect_val: -5,
    },
];

POSSIBLE_SALES = [
    {
        company: 'MINISTRY OF INTERIOR AFFAIRS',
        is_percentage: true,
        discount: 5,
        action: 'Determine Gender: Female',
        logo: 'interior.svg',
    },
    {
        company: 'NSA',
        is_percentage: true,
        discount: 35,
        action: 'classified',
        logo: 'nsa.svg',
    },
    {
        company: 'Facebook',
        is_percentage: true,
        discount: 40,
        action: 'Increase sharing tendencies',
        logo: 'facebook.svg',
    },
    {
        company: 'Military',
        is_percentage: true,
        discount: 80,
        action: 'Increased stamina and aggressiveness',
        logo: 'military.svg',
    },
    {
        company: 'Ministry of Education',
        is_percentage: false,
        discount: 75000,
        action: 'Increased Discipline',
        logo: 'education.svg',
    },
    {
        company: 'TU/e',
        is_percentage: false,
        discount: 10000,
        action: 'Increased mental capabilities',
        logo: 'tue.svg',
    },
    {
        company: '777',
        is_percentage: false,
        discount: 100000,
        action: 'Risk Taking Tendencies',
        logo: '777.svg',
    },
];