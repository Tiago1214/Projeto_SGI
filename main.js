import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Variaveis
let largura_Canvas = 800;
let altura_Canvas = 400;

let isPaused = false;

//Criar cena
let cena = new THREE.Scene();

//Criar e configurar o renderer
let targetCanvas = document.getElementById("meuCanvas");
let renderer = new THREE.WebGLRenderer({ canvas : targetCanvas});
renderer.setSize(largura_Canvas, altura_Canvas);
renderer.shadowMap.enabled = true;

//camera na posição inicial (6,4,7)
let camera = new THREE.PerspectiveCamera(75, largura_Canvas/altura_Canvas, 0.1, 800);
camera.lookAt(0,0,0);
camera.position.set(10,5,10);

// Orbits
new OrbitControls(camera, renderer.domElement) 

//Auxilaires visuais
//let grelha = new THREE.GridHelper();

//cena.add(grelha);


//Animações do gltf
let relogio = new THREE.Clock();
let misturador = new THREE.AnimationMixer(cena)
let acaoLocSupJointRot
let acaoLongArmAction
let acaoShortArmAction
let acaoArmToAbajurJointAction
let acaoAbajurJointAction






//improtar modelo
let loader = new GLTFLoader();
loader.load(
    "./blender/models/ApliqueArticuladoPecaUnica.gltf",
    function(gltf){
        cena.add(gltf.scene);

        cena.traverse( function(obj){
            if (!obj.isMesh) {
                return                
            }

            obj.castShadow = true;
            obj.receiveShadow = true;

        });

        
        //Animação SupportJoint
        let SupJoinAction = THREE.AnimationClip.findByName( gltf.animations, 'SupJoinAction' )
        acaoLocSupJointRot = misturador.clipAction( SupJoinAction )
        acaoLocSupJointRot.play()
        misturador.update( relogio.getDelta() )


        //Animação LongArm
        let LongArmAction = THREE.AnimationClip.findByName( gltf.animations, 'LongArmAction' )
        acaoLongArmAction = misturador.clipAction( LongArmAction )
        acaoLongArmAction.play()
        misturador.update( relogio.getDelta() )


        //Animação ShortArm
        let ShortArmAction = THREE.AnimationClip.findByName( gltf.animations, 'ShortArmAction' )
        acaoShortArmAction = misturador.clipAction( ShortArmAction )
        acaoShortArmAction.play()
        misturador.update( relogio.getDelta() )

        //Animação ArmToAbajurJoint
        let ArmToAbajurJointAction = THREE.AnimationClip.findByName( gltf.animations, 'ArmToAbajurJointAction' )
        acaoArmToAbajurJointAction = misturador.clipAction( ArmToAbajurJointAction )
        acaoArmToAbajurJointAction.play()
        misturador.update( relogio.getDelta() )

        //Animação AbajurJointAction
        let AbajurJointAction = THREE.AnimationClip.findByName( gltf.animations, 'AbajurJointAction' )
        acaoAbajurJointAction = misturador.clipAction( AbajurJointAction )
        acaoAbajurJointAction.play()
        misturador.update( relogio.getDelta() )


// Apply rotation
    }


)

//ILUMINAÇÃO
//ponto de luz
const luzPonto = new THREE.PointLight( "white", 100 );
luzPonto.position.set( 5, 3, 5);
luzPonto.castShadow = true;
cena.add( luzPonto ) 
cena.background = new THREE.Color(0xffffff); 


const pointLightHelper = new THREE.PointLightHelper( luzPonto, 0.2 );
cena.add( pointLightHelper );


//Renderizar e animar 
let delta = 0;
    //let relogio = new THREE.Clock();
let latencia_minima = 1/60;

function animar(){
    requestAnimationFrame(animar);

    delta+= relogio.getDelta();

    if(delta < latencia_minima)
        return;

    
    misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    renderer.render(cena, camera);
    delta = delta%latencia_minima;

}

animar();

window.cena = cena;



//BOTOES - Controlo Interativo

let btnPlay = document.getElementById("btn_play")
btnPlay.onclick = function(){
   if(isPaused){
        acaoLocSupJointRot.paused = false
        acaoLongArmAction.paused = false
        acaoShortArmAction.paused = false
        acaoArmToAbajurJointAction.paused = false
        acaoAbajurJointAction.paused = false
        isPaused = false;
   }else{
        acaoLocSupJointRot.play();
        acaoLongArmAction.play();
        acaoShortArmAction.play();
        acaoArmToAbajurJointAction.play();
        acaoAbajurJointAction.play();
   }
}

let btnPause = document.getElementById("btn_pause")
btnPause.onclick = function(){
    acaoLocSupJointRot.paused = true
    acaoLongArmAction.paused = true
    acaoShortArmAction.paused = true
    acaoArmToAbajurJointAction.paused = true
    acaoAbajurJointAction.paused = true
    isPaused = true
}

let btnStop = document.getElementById("btn_stop")
btnStop.onclick = function(){
    
    acaoLocSupJointRot.stop();
    acaoLongArmAction.stop();
    acaoShortArmAction.stop();
    acaoArmToAbajurJointAction.stop();
    acaoAbajurJointAction.stop();
}

let btnReverse = document.getElementById("btn_reverse")
btnReverse.onclick = function(){
    acaoLocSupJointRot.timeScale = -acaoLocSupJointRot.timeScale
    acaoLongArmAction.timeScale = -acaoLongArmAction.timeScale
    acaoShortArmAction.timeScale = -acaoShortArmAction.timeScale
    acaoArmToAbajurJointAction.timeScale = -acaoArmToAbajurJointAction.timeScale
    acaoAbajurJointAction.timeScale = -acaoAbajurJointAction.timeScale
}

let menu = document.getElementById("menu_loop")
menu.onchange = function(){
    switch(this.value){
        case '1':
            acaoLocSupJointRot.reset();
            acaoLongArmAction.reset();
            acaoShortArmAction.reset();
            acaoArmToAbajurJointAction.reset();
            acaoAbajurJointAction.reset();
            
            acaoLocSupJointRot.setLoop(THREE.LoopOnce);
            acaoLocSupJointRot.clampWhenFinished = true;
            acaoLongArmAction.setLoop(THREE.LoopOnce);
            acaoLongArmAction.clampWhenFinished = true;
            acaoShortArmAction.setLoop(THREE.LoopOnce);
            acaoShortArmAction.clampWhenFinished = true;
            acaoArmToAbajurJointAction.setLoop(THREE.LoopOnce);
            acaoArmToAbajurJointAction.clampWhenFinished = true;
            acaoAbajurJointAction.setLoop(THREE.LoopOnce);
            acaoAbajurJointAction.clampWhenFinished = true;
            
            break;
        case '3':
            acaoLocSupJointRot.reset();
            acaoLongArmAction.reset();
            acaoShortArmAction.reset();
            acaoArmToAbajurJointAction.reset();
            acaoAbajurJointAction.reset();

            acaoLocSupJointRot.setLoop(THREE.LoopPingPong);
            acaoLongArmAction.setLoop(THREE.LoopPingPong);
            acaoShortArmAction.setLoop(THREE.LoopPingPong);
            acaoArmToAbajurJointAction.setLoop(THREE.LoopPingPong);
            acaoAbajurJointAction.setLoop(THREE.LoopPingPong);
            break;
        default:
            acaoLocSupJointRot.reset();
            acaoLongArmAction.reset();
            acaoShortArmAction.reset();
            acaoArmToAbajurJointAction.reset();
            acaoAbajurJointAction.reset();

            acaoLocSupJointRot.setLoop(THREE.LoopPingPong);
            acaoLongArmAction.setLoop(THREE.LoopPingPong);
            acaoShortArmAction.setLoop(THREE.LoopPingPong);
            acaoArmToAbajurJointAction.setLoop(THREE.LoopPingPong);
            acaoAbajurJointAction.setLoop(THREE.LoopPingPong);

    }
}
