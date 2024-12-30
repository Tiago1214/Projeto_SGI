import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Variaveis
let largura_Canvas = 400;
let altura_Canvas = 150;

let isPaused = false;

//Criar cena
let cena = new THREE.Scene();

//Criar e configurar o renderer
let targetCanvas = document.getElementById("meuCanvas");
let renderer = new THREE.WebGLRenderer({ canvas : targetCanvas});
renderer.setSize(largura_Canvas, altura_Canvas);
renderer.shadowMap.enabled = true;

//camera na posição inicial (6,4,7)
let camera = new THREE.PerspectiveCamera(70, largura_Canvas/altura_Canvas, 0.1, 1000);
camera.lookAt(0,0,0);
camera.position.set(6,4,7);

// Orbits
new OrbitControls(camera, renderer.domElement) 

//Auxilaires visuais
let grelha = new THREE.GridHelper();
cena.add(grelha);


//Animações do gltf
let relogio = new THREE.Clock();
let misturador = new THREE.AnimationMixer(cena)
let acaoLocY
let acaoLocZ
let acaoRotZ



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

        
        //Animação LocY
        let clipeLocY = THREE.AnimationClip.findByName( gltf.animations, 'LocY' )
        acaoLocY = misturador.clipAction( clipeLocY )
        acaoLocY.play()
        misturador.update( relogio.getDelta() )


        //Animação LocZ
        let clipeLocZ = THREE.AnimationClip.findByName( gltf.animations, 'LocZ' )
        acaoLocZ = misturador.clipAction( clipeLocZ )
        acaoLocZ.play()
        misturador.update( relogio.getDelta() )


        //Animação RotZ
        let clipeRotZ = THREE.AnimationClip.findByName( gltf.animations, 'RotZ' )
        acaoRotZ = misturador.clipAction( clipeRotZ )
        acaoRotZ.play()
        misturador.update( relogio.getDelta() )

    }


)

//ILUMINAÇÃO
//ponto de luz
const luzPonto = new THREE.PointLight( "white", 30 );
luzPonto.position.set( 5, 3, 5);
luzPonto.castShadow = true;
cena.add( luzPonto ) 

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
        acaoLocY.paused = false
        acaoLocZ.paused = false
        acaoRotZ.paused = false
        isPaused = false;
   }else{
        acaoLocY.play();
        acaoLocZ.play();
        acaoRotZ.play();
   }
}

let btnPause = document.getElementById("btn_pause")
btnPause.onclick = function(){
    acaoLocY.paused = true
    acaoLocZ.paused = true
    acaoRotZ.paused = true
    isPaused = true
}

let btnStop = document.getElementById("btn_stop")
btnStop.onclick = function(){
    
    acaoLocY.stop();
    acaoLocZ.stop();
    acaoRotZ.stop();
}

let btnReverse = document.getElementById("btn_reverse")
btnReverse.onclick = function(){
    acaoLocY.timeScale = -acaoLocY.timeScale
    acaoLocZ.timeScale = -acaoLocZ.timeScale
    acaoRotZ.timeScale = -acaoRotZ.timeScale
}

let menu = document.getElementById("menu_loop")
menu.onchange = function(){
    switch(this.value){
        case '1':
            acaoLocY.reset();
            acaoLocZ.reset();
            acaoRotZ.reset();
            
            acaoLocY.setLoop(THREE.LoopOnce);
            acaoLocY.clampWhenFinished = true;
            acaoLocZ.setLoop(THREE.LoopOnce);
            acaoLocZ.clampWhenFinished = true;
            acaoRotZ.setLoop(THREE.LoopOnce);
            acaoRotZ.clampWhenFinished = true;
            
            break;
        case '3':
            acaoLocY.reset();
            acaoLocZ.reset();
            acaoRotZ.reset();

            acaoLocY.setLoop(THREE.LoopPingPong);
            acaoLocZ.setLoop(THREE.LoopPingPong);
            acaoRotZ.setLoop(THREE.LoopPingPong);
            break;
        default:
            acaoLocY.reset();
            acaoLocZ.reset();
            acaoRotZ.reset();

            acaoLocY.setLoop(THREE.LoopRepeat);
            acaoLocZ.setLoop(THREE.LoopRepeat);
            acaoRotZ.setLoop(THREE.LoopRepeat);

    }
}
