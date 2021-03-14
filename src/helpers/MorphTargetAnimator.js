import {
    MathUtils
} from 'three'

import * as TWEEN from 'es6-tween';

export default class MorphTargetAnimator {
    constructor(mesh, isAutoAnimated = true) {
        this.mesh = mesh;
        this.isAutoAnimated = isAutoAnimated;
        this.morphTargets = [];
        TWEEN.autoPlay(true);

        // this.autoAnimate(5000, 7000).then(() => console.log("Done!"));

        this.minInterval = 5000;
        this.maxInterval = 7000;

        if(isAutoAnimated){
            setInterval(() => { // TODO: Change to promises
                this.animateRandom()
            }, MathUtils.randInt(this.minInterval, this.maxInterval));
        }
    }

    animate(key) {
        return new Promise((resolve, reject) => {
            let morphTargetParams = this.morphTargets.find((item) => {
                return item.key === key
            });
            var morphTargetIndex = this.mesh.morphTargetDictionary[key];
            
            if (morphTargetParams) {
                var currentValue = {
                    v: this.mesh.morphTargetInfluences[morphTargetIndex]
                };
                this.tween = new TWEEN.Tween(currentValue)
                    .to({
                        v: morphTargetParams.targetValue
                    }, morphTargetParams.transition)
                    .on('update',
                        () => {
                            this.mesh.morphTargetInfluences[morphTargetIndex] = currentValue.v;
                        }
                    )
                    .on('complete', () => {
                        resolve()
                    })
                    .repeat(1)
                    .delay(morphTargetParams.duration)
                    .yoyo(true)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .start();
            }
        })
    }

    animateRandom() {
        if(this.morphTargets.length > 0){
            this.animate(this.getRandomParamKey());
        }
    }

    // async autoAnimate(minInterval, maxInterval) {   
    //     MathUtils.randInt(minInterval, maxInterval);
    //     var shuffledArray = this.selectedMorphTargets
    //         .map((a) => ({
    //             sort: Math.random(),
    //             value: a
    //         }))
    //         .sort((a, b) => a.sort - b.sort)
    //         .map((a) => a.value)

    //     for (const element of shuffledArray) {
    //         await this.animate(element.key);
    //     }

    // }

    //   stop(){
    //     this.morphTarget = 0;
    //   }

    add(key, targetValue = 1, transition = 1000, duration = 2000) {
        this.morphTargets.push({
            key: key,
            targetValue: targetValue,
            transition: transition,
            duration: duration
        })
    }

    addRange(morphParams) {
        morphParams.forEach(param => {
            this.add(
                param.key,
                param.targetValue,
                param.transition,
                param.duration
            )
        });
    }

    getRandomParamKey() {
        return this.morphTargets[Math.floor(Math.random() * this.morphTargets.length)].key;
    }

    remove(key) {
        this.morphTargets.splice(this.morphTargets.findIndex(item => item.key === key), 1)
    }
}