function getMat(color) {
    // our material is a phong material, with no shininess (highlight) and a black specular
    // return new THREE.MeshStandardMaterial({
    //     color: color,
    //     roughness: .9,
    //     transparent: false,
    //     opacity: 0,
    //     emissive: 0x270000,
    //     shading: THREE.FlatShading
    // });
    var texture = new THREE.TextureLoader().load(color);
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture; //材质的Map属性用于添加纹理
    var bump = new THREE.TextureLoader().load('img/b4.jpg'); //添加凹凸纹理
    mat.bumpMap = bump;
    mat.bumpScale = 0.2;
    return mat;

}
// var Colors = {
//     red: 0xf85051,
//     orange: 0xea8962,
//     yellow: 0xdacf75,
//     beige: 0xccc58f,
//     grey: 0xbab7a1,
//     blue: 0x4379a8,
//     ocean: 0x4993a8,
//     green: 0x24a99b
// };
var Colors = {
    red: 'img/earth4.jpg',
    orange: 'img/b3.jpg',
    yellow: 'img/b1.jpg',
    beige: 'img/b2.jpg',
    grey: 'img/b4.jpg',
    blue: 'img/b5.jpg',
    ocean: 'img/b6.jpg',
    green: 'img/b7.jpg'
};

var colorsLength = Object.keys(Colors).length;

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor() {
    var colIndx = Math.floor(Math.random() * colorsLength);
    var colorStr = Object.keys(Colors)[colIndx];
    return Colors[colorStr];
}

function shiftPosition(pos, radius) {
    if (Math.abs(pos) < radius) {
        if (pos >= 0) {
            return pos + radius;
        } else {
            return pos - radius;
        }
    } else {
        return pos;
    }
}


// For a THREEJS project we need at least
// a scene
// a renderer
// a camera
// a light (1 or many)
// a mesh (an object to display)

var scene, renderer, camera, light;
var stars = [];
var planets = [];
var nbPlanetsMax = 4;
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;


// initialise the world
function initStar() {
    scene = new THREE.Scene(); //创建场景
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 2000); //创建以75度视角，比例与当前页面的比例相等，最远2000，最近.1的相机
    //视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far
    camera.position.z = 200; //相机位置。

    renderer = new THREE.WebGLRenderer({
        alpha: true, //是否可以设置背景色透明  
        antialias: true //是否开启反锯齿  
    }); //创建渲染器，使用WebGL来绘制场景
    renderer.setSize(WIDTH, HEIGHT); //场景大小
    renderer.shadowMap.enabled = true; //启用在场景中的阴影贴图。

    container = document.getElementById('universe'); //引用元素
    container.appendChild(renderer.domElement); //将渲染器的画布加入到元素中

    // Lights
    ambientLight = new THREE.AmbientLight(0x663344, 2); //环境光，第一个参数是光的颜色，第二个参数是光的强度值
    scene.add(ambientLight); //给场景增加环境光

    light = new THREE.DirectionalLight(0xffffff, 1.5); //平行光
    light.position.set(200, 100, 200); //平行光的位置
    light.castShadow = true; //光照将产生动态阴影
    //light.shadow该属性存储渲染光照阴影的所有相关信息。
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -400;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add(light);

    //
    // HANDLE SCREEN RESIZE
    //
    window.addEventListener('resize', handleWindowResize, false); //监控当窗口改变大小时

    // Creating firts planets
    //  for (var i = 0; i < nbPlanetsMax; i++) { //创建星球
    //      planets.push(new Planet(-2000 / nbPlanetsMax * i - 500));

    // }
    addStarts(); //创建星星
    loop(); //轮换播放动画

}

function animateStars(z) {

    // loop through each star
    for (var i = 0; i < stars.length; i++) {

        star = stars[i];
        // if the particle is too close move it to the back
        if (star.position.z > z) star.position.z -= 2000;

    }

}

function addStarts() {

    for (var z = -2000; z < 0; z += 20) {

        var geometry = new THREE.SphereGeometry(0.5, 32, 32) //创建球形星星
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var sphere = new THREE.Mesh(geometry, material) //给星星设置颜色

        sphere.position.x = randomRange(-1 * Math.floor(WIDTH / 2), Math.floor(WIDTH / 2));
        sphere.position.y = randomRange(-1 * Math.floor(HEIGHT / 2), Math.floor(HEIGHT / 2));

        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;

        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;

        //add the sphere to the scene
        scene.add(sphere);

        //finally push it to the stars array
        stars.push(sphere);
    }
}

// var Planet = function(z) {
//     //console.log("z===============" + z);
//     // the geometry of the planet is a tetrahedron
//     this.planetRadius = randomRange(12, 30);
//     var planetDetail = randomRange(2, 3);
//     var geomPlanet = new THREE.TetrahedronGeometry(this.planetRadius, planetDetail); //以this.planetRadius为半径，planetDetail为顶点
//     //细节因子,默认为0,当超过0将会有更多的顶点,当前的几何体就不会是四面体,当参数detail大于1,将会变成一个球体.
//     //  var geomPlanet = new THREE.SphereGeometry(this.planetRadius,32,32); //创建以this.planetRadius为半径的，32面的球体
//     var noise = randomRange(1, 5);
//     for (var i = 0; i < geomPlanet.vertices.length; i++) { //球体的每个顶点
//         var v = geomPlanet.vertices[i];
//         v.x += -noise / 2 + Math.random() * noise;
//         v.y += -noise / 2 + Math.random() * noise;
//         v.z += -noise / 2 + Math.random() * noise;
//     }

//     // create a new material for the planet
//     var color = getRandomColor(); //随机获取颜色
//     var matPlanet = getMat(color); //获取材料
//     // create the mesh of the planet
//     this.planet = new THREE.Mesh(geomPlanet, matPlanet); //为球体贴图创建出一个Mesh模型

//     // Create a global mesh to hold the planet and the ring
//     this.mesh = new THREE.Object3D(); //创建一个3d物体对象，这里这样写的目的是如果星球由环，可以把环加入到3d对象中，构成一个整体
//     this.mesh.add(this.planet);


//     // Three.js的光源默认不会导致物体间的投影，打开投影需要执行以下几步：

//     // 打开渲染器的地图阴影: renderer.shadowMapEnabled = true;

//     // 启用光线的投影：light.castShadow = true;

//     // 把模型设置为生成投影：mesh.castShadow = true;

//     // 把模型设置为接收阴影：mesh.receiveShadow= true;
//     this.planet.castShadow = true;
//     this.planet.receiveShadow = true;

//     // update the position of the particles => must be moved to the loop
//     this.mesh.rotation.x = (Math.random() * 2 - 1) * 2 * Math.PI;
//     this.mesh.rotation.z = (Math.random() * 2 - 1) * 2 * Math.PI;

//     var posX = randomRange(-1 * Math.floor(WIDTH / 4), Math.floor(WIDTH / 4));
//     var posY = randomRange(-1 * Math.floor(HEIGHT / 4), Math.floor(HEIGHT / 4));
//     posX = shiftPosition(posX, this.planetRadius);
//     posY = shiftPosition(posY, this.planetRadius);
//     //console.log(posX, posY, z);
//     this.mesh.position.set(posX, posY, z); //3d物体的位置
//     scene.add(this.mesh); //把物体增加到场景中去
// }
// Planet.prototype.destroy = function() {
//     scene.remove(this.mesh);
// }

// function addPlanet(z) {
//     planets.push(new Planet(z));
// }

function loop() {
    //var horizon = -2000 + camera.position.z;
    //  for (var i = 0; i < planets.length; i++) {
    //     //console.log("mesh:" + planets[i].mesh.position.z + ",camera:" + camera.position.z);
    //     if (planets[i].mesh.position.z > camera.position.z) {
    //         planets[i].destroy();
    //         planets.splice(i, 1);
    //     }
    //     //找到
    //     // If the planet is arriving
    //     // if (planets[i].mesh.position.z > horizon && planets[i].planet.material.opacity < 1) {
    //     //     planets[i].planet.material.opacity += 0.005;
    //     //     console.log("111:"+camera.position.z);
    //     // }
    // }


    // Adding stars
    animateStars(camera.position.z);

    // if (planets.length < nbPlanetsMax) {
    //     addPlanet(camera.position.z - 2000);
    // }

    // for (var i = 0; i < planets.length; i++) {
    //     planets[i].planet.rotation.y -= 0.01;
    // }

    camera.position.z -= 2;

    //
    // RENDER !
    //
    renderer.render(scene, camera); //渲染结合相机和场景来得到结果画面

    //
    // REQUEST A NEW FRAME
    //
    requestAnimationFrame(loop); //循环渲染
}

function handleWindowResize() {
    // Recalculate Width and Height as they had changed
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    // Update the renderer and the camera
    renderer.setSize(WIDTH, HEIGHT); //改变渲染器的大小
    camera.aspect = WIDTH / HEIGHT; //aspect为观察空间的宽高比=实际窗口的纵横比
    camera.updateProjectionMatrix(); //调用updateProjectionMatrix方法,更新相机的投影矩阵. 
}
initStar();
// for (var i = 1; i <= 18; i++) {
//     $('.ball1pic').append('<img src="img/ball1/b' + i + '.png" class="img-' + i + '">');
// };
// $('.ball1pic img.img-1').addClass('show');
// var fps = 1000 /6//(这里表示一秒12帧);
// var p0;
// var p0Index = 11;
// p0 = setInterval(p0Draw, fps);
// function p0Draw() {
//     $('.ball1pic img.img-' + p0Index).removeClass("show");
//     p0Index++;
//     $('.ball1pic img.img-' + p0Index).addClass('show');
//     if (p0Index == 19) {
//         p0Index = 1;
//         $('.ball1pic img.img-1').addClass('show');
//     }
// }