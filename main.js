import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//Variaveis
let largura_Canvas = 800;
let altura_Canvas = 400;
let suporte   
let lampada_cilindrica
let lampada_esferica
// Cor default para as luzes e cor da lampada
const cor_default = new THREE.Color("lightblue")


let isPaused = false;
let isOff = false;
//Criar cena
let cena = new THREE.Scene();

//Criar e configurar o renderer
let targetCanvas = document.getElementById("meuCanvas");
let renderer = new THREE.WebGLRenderer({ canvas : targetCanvas});
renderer.setSize(largura_Canvas, altura_Canvas);
renderer.shadowMap.enabled = true;

//camera na posição inicial (6,4,7)
let camera = new THREE.PerspectiveCamera(75, largura_Canvas/altura_Canvas, 0.1, 800);
camera.lookAt(0,-1,2.5);
camera.position.set(0,-3,12);

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
let alvo = null

// Carregar modelo, ajustar luzes, e preparar cena exemplo

loader.load(
    "./blender/models/ApliqueArticuladoPecaUnica.gltf",
    function(gltf){
        // informacao: 1 unidade = 0.1m = 1 dm = 10 cm

        cena.add(gltf.scene);

        suporte = cena.getObjectByName("Support")
        console.log(suporte)

        // Configurar das fontes luminosas do modelo
        const ponto_luminoso = cena.getObjectByName("Point")
        const cone_luminoso = cena.getObjectByName("Spot")
        ponto_luminoso.intensity = 3
        ponto_luminoso.distance = 1.25  // 0.125 metros
        cone_luminoso.intensity = 16
        cone_luminoso.distance = 10     // 1 metro; ajustar consoante o pretendido 
        ponto_luminoso.color = cone_luminoso.color = cor_default // alterar cor da luz
        console.log(ponto_luminoso)

        // Obter os dois tipos de lampada e esconder a redonda
        lampada_cilindrica = cena.getObjectByName("C_LightBulb")
        lampada_esferica = cena.getObjectByName("S_LightBulb")
        lampada_esferica.visible = false
        
        // Ajustar a cor da lampada visivel
        lampada_cilindrica.children[0].material.emissive = cor_default// alterar cor da lampada
        console.log(lampada_cilindrica)
        
        cena.traverse(function(obj) {            
            if (obj.name == "Abajur") {
                alvo = obj;
            }
            
            if (!obj.isMesh) {
                return;
            }

            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        suporte.position.y -= 5;
        //Animação SupportJoint
        let SupJoinAction = THREE.AnimationClip.findByName( gltf.animations, 'SupJoinAction' )
        acaoLocSupJointRot = misturador.clipAction( SupJoinAction )
        acaoLocSupJointRot.setLoop(THREE.LoopOnce)
        misturador.update( relogio.getDelta() )


        //Animação LongArm
        let LongArmAction = THREE.AnimationClip.findByName( gltf.animations, 'LongArmAction' )
        acaoLongArmAction = misturador.clipAction( LongArmAction )
        acaoLongArmAction.setLoop(THREE.LoopOnce)
        misturador.update( relogio.getDelta() )


        //Animação ShortArm
        let ShortArmAction = THREE.AnimationClip.findByName( gltf.animations, 'ShortArmAction' )
        acaoShortArmAction = misturador.clipAction( ShortArmAction )
        acaoShortArmAction.setLoop(THREE.LoopOnce)
        misturador.update( relogio.getDelta() )

        //Animação ArmToAbajurJoint
        let ArmToAbajurJointAction = THREE.AnimationClip.findByName( gltf.animations, 'ArmToAbajurJointAction' )
        acaoArmToAbajurJointAction = misturador.clipAction( ArmToAbajurJointAction )
        acaoArmToAbajurJointAction.setLoop(THREE.LoopOnce)
        misturador.update( relogio.getDelta() )

        //Animação AbajurJointAction
        let AbajurJointAction = THREE.AnimationClip.findByName( gltf.animations, 'AbajurJointAction' )
        acaoAbajurJointAction = misturador.clipAction( AbajurJointAction )
        acaoAbajurJointAction.setLoop(THREE.LoopOnce)
        misturador.update( relogio.getDelta() )


// Apply rotation
    }


)

//ILUMINAÇÃO
//ponto de luz
const luzPonto = new THREE.PointLight( "white", 100 );
luzPonto.position.set( 5, 7, 5);
luzPonto.castShadow = true;
cena.add( luzPonto ) 
cena.background = new THREE.Color(0xD3D3D3); 



const pointLightHelper = new THREE.PointLightHelper( luzPonto, 0.2 );
//cena.add( pointLightHelper );




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
let btnLight = document.getElementById("btn_light")
btnLight.onclick = function(){
    const ponto_luminoso = cena.getObjectByName("Point");
    const cone_luminoso = cena.getObjectByName("Spot");
    if(isOff){
        isOff=false;
        lampada_esferica.visible = false
        lampada_cilindrica.children[0].material.emissive = cor_default
        ponto_luminoso.intensity = 3; // Reativar intensidade
        cone_luminoso.intensity = 16;
        btnLight.innerText="Desligar Luz"
        btnLight.style.backgroundColor = "#FF0000";
    }
    else{
        isOff=true;
        lampada_esferica.visible = true
        //lampada_cilindrica.children[0].material.emissive = new THREE.Color("black");
        ponto_luminoso.intensity = 0; // apagar luzes
        cone_luminoso.intensity = 0;
        btnLight.innerText="Ligar Luz"
        btnLight.style.backgroundColor = "#007bff";
        
    }
}


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
        acaoLocSupJointRot.reset();
        acaoLongArmAction.reset();
        acaoShortArmAction.reset();
        acaoArmToAbajurJointAction.reset();
        acaoAbajurJointAction.reset();

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


//COLORS
let currentColor = new THREE.Color("black");
let btn_red = document.getElementById("btn_red")
let color = new THREE.Color("red");
btn_red.onclick = function(){
    alvo.children[0].material.color.set(color); 
    currentColor = color;
}
let btn_blue = document.getElementById("btn_blue")
let color2 = new THREE.Color("lightblue");
btn_blue.onclick = function(){
    alvo.children[0].material.color.set(color2); 
    currentColor = color2;
}
let btn_grey = document.getElementById("btn_grey")
let color3 = new THREE.Color("grey");
btn_grey.onclick = function(){
    alvo.children[0].material.color.set(color3); 
    currentColor = color3;
}
let btn_black = document.getElementById("btn_black")
let color4 = new THREE.Color("black");
btn_black.onclick = function(){
    alvo.children[0].material.color.set(color4); 
    currentColor = color4;
}


//MATERIALS

let plasticMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
});
let glassMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    metalness: 0,
    opacity: 0.5,
    transparent: true,
    transmission: 0.9,
});
let matalicMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.5,
    metalness: 1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
});
let menu = document.getElementById("btn_material")
menu.onchange = function(){
    switch(this.value){
        case '1':
            alvo.children[0].material = plasticMaterial;
            alvo.children[0].material.color.set(currentColor);
            
            break;
        case '2':
            alvo.children[0].material = matalicMaterial;
            alvo.children[0].material.color.set(currentColor);
            break;
        case '3':
            alvo.children[0].material = glassMaterial;
            alvo.children[0].material.color.set(currentColor);
            break;
        
    }
}




