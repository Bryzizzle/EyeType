// Resize eyeballs to this size
var inx = 128;
var iny = 128;

// Prediction vars
var rBB, lBB;
var prediction; // Face mesh predict() output
var output;

// Embeddings and other features
var curEyes = []
var rawPred;
var natureModelEmbeddings;
var faceGeom;
var allFeatures_mat;

//SVR vars
var svr_x;
var svr_y;

// Window stuff
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

// Show HTML prediction dot or p5js
var showPredictDot = true;

// Easing for the eye prediction
var easX = 0;
var easY = 0;
var easefactor = .15;
var dotelem;

// Store prediction values
let globalPredX = 0;
let globalPredY = 0;


//Draw the prediction as an orange dot on the screen.
async function drawPrediction() {
//    console.log("Drawing prediction in SVR");
    if (typeof(curPred) == "undefined"){
        setTimeout(drawPrediction, 300);
        return;
    }

    //Generate prediction dot
    predX = Math.floor(curPred[0]*100);
    predY = Math.floor(curPred[1]*130);

    predX = Math.min(Math.max(predX, 0), 100);
    predY = Math.min(Math.max(predY, 0), 100);

    easX = easX + (predX-easX)*easefactor;
    easY = easY + (predY-easY)*easefactor;
    predX = easX;
    predY = easY;

    // Store pred values to global vars
    globalPredX = predX;
    globalPredY = predY;

    elem = document.getElementById("dotelem");

    if (regression){
        elem.style.left = "calc(" + predX + "% - 50px)";
        elem.style.top = "calc(" + predY + "% - 50px)";
    } else{
        // Dividing regions, by percentage
        let x_bounds = [25, 75];
        let y_bounds = [25, 75];

         // Classification, 3x3
         col_left = predX >= x_bounds[0];
         col_right = predX <= x_bounds[1];
         whichCol_Xcoord = col_left ? 5 : (col_right ? 95 : 50)

         row_top = predY <= y_bounds[0];
         row_bot = predY >= y_bounds[1];
         whichRow_Ycoord = row_top ? 5 : (row_bot ? 95 : 50);

        // Set dot and highlighted region lightup
        elem.setAttribute("style", "left:"+ whichCol_Xcoord +"%;top:"+ whichRow_Ycoord +"%;");
    }


    if (showPredictDot){


//        if (!regression){
//            document.body.appendChild(reg);
//        }
    }
    requestAnimationFrame(drawPrediction);
};

// For greying out images
function greyscaleImage(imTensor){
    return tf.tidy(() => {
        return imTensor.mean(2).reshape([inx, iny, 1]).tile([1,1,3]);
    });
}


var loopTimes = [];
async function runSVRlive(){
    if (curEyes[0] == undefined && !stopFacemesh){
        console.log("curEyes undefined while running prediction, trying again")
        setTimeout(runSVRlive, 500);
        return
    }
    let startTime = performance.now();

    rawPred = tf.tidy(() => {
                let curGeom = tf.tensor(faceGeom.getGeom()).reshape([1,4]);
                let embed = natureModelEmbeddings.predict([curEyes[0].div(256).sub(0.5).reshape([1, 128, 128, 3]), curEyes[1].div(256).sub(0.5).reshape([1, 128, 128, 3]), curEyes[2].reshape([1, 8]), curGeom]);
                embed[0] = embed[0].div(100);
                embed[1] = embed[1].div(10);
                embed = tf.concat(embed, 1);

                allFeatures = tf.concat([embed, curEyes[2].reshape([1,8]), curGeom], 1);
                allFeatures_mat = array2mat(allFeatures.arraySync());

                return [svr_x.predict(allFeatures_mat), svr_y.predict(allFeatures_mat)]
            })

    let a = 0.5;
    curPred[0] = curPred[0]*(1-a) + rawPred[0]*a;
    curPred[1] = curPred[1]*(1-a) + rawPred[1]*a;

    let edge = 0.01
    curPred[0] = Math.max(edge, Math.min(1-edge, curPred[0]))
    curPred[1] = Math.max(edge, Math.min(1-edge, curPred[1]))

    requestAnimationFrame(runSVRlive);

}

var w_op = [100/10, 100/2, 9*100/10];
var h_op = [100/10, 100/2, 9*100/10];
var nx_arr = [w_op[1], w_op[2], w_op[0], w_op[2], w_op[1], w_op[0], w_op[1], w_op[0], w_op[2], w_op[2]]
var ny_arr = [h_op[0], h_op[2], h_op[1], h_op[0], h_op[1], h_op[2], h_op[2], h_op[0], h_op[1], h_op[1]];
var targetNum = 0;
var targetTimerLen = 10;
var targetTimerCount = 0;
async function drawTargetDot(){
    // Remove old target dots
    const targs = document.getElementsByClassName('targetdot');
    while (targs.length > 0){ targs[0].parentNode.removeChild(targs[0]); };

    // Create a new one
    targDot = document.createElement("div");
    targDot.setAttribute("class", "targetdot");
    document.body.appendChild(targDot);



    // update target number if enough time has passed. This is to make the target dot reactive
    targetTimerCount += 1;
    let nextTargetNum;
    if (targetTimerCount % targetTimerLen == 0){
        nextTargetNum = (targetNum + 1) % ny_arr.length;
    } else{
        nextTargetNum = targetNum % ny_arr.length;
    }
    targetNum = nextTargetNum;


    // Call self again after delay
    setTimeout(drawTargetDot, 500);
}


var eyeHist = [];
function showDebug(){
    if (typeof(videoCanvas) == 'undefined'){
        console.log("showing debug failed since no videoCanvas, restarting");
        setTimeout(showDebug, 500);
        return;
    }

    setTimeout(() => {
        dotelem = document.createElement("div");
        dotelem.setAttribute("class", "predicdot");
        dotelem.id = "dotelem";
        dotelem.style.zIndex = "800";
        regression = true;
        document.body.appendChild(dotelem);


        drawPrediction();

        console.log("showing debug");
        document.body.style.backgroundColor = "white";


        setInterval(() => {
            // Update eye history
            eyeHist.push([...curPred]);
            if (eyeHist.length > 25) eyeHist.shift();
            xs = eyeHist.map((e) => e[0]);
            ys = eyeHist.map((e) => e[1]);

            let truthArr = [prediction.faceInViewConfidence > .9,
                            abs(faceGeom.curYaw) < .3,
                  ((Math.max(...xs) - Math.min(...xs)) < .3) && ((Math.max(...ys) - Math.min(...ys)) < .3)];

            // Hide dot if not all proper
            elem = document.getElementById("dotelem");
            if (truthArr.every((x) => x)){
                elem.hidden = false;
                // elem.style.backgroundColor = "green";
            } else if (truthArr.slice(0,2).every((x) => x)){
                elem.hidden = false;
                // elem.style.backgroundColor = "red";
            } else {
                elem.hidden = true;
            }

        }, 50);

    }, 500);
}

// Draw regression button
var regression = false;
function regr_class_toggle() {
    var x = document.getElementById("regtoggle");
    if (x.innerHTML === "<h4>Regression</h4>") {
        x.innerHTML = "<h4>Classification</h4>";
        x.style.background = "#2196F3";
        regression = false;
    } else {
        x.innerHTML = "<h4>Regression</h4>";
        x.style.background = "#ccc";
        regression = true;
    }
}



async function main() {
    tf.setBackend('webgl');
    await tf.ready();

    await collectmain();

    // import custom model
    models = [];
    console.log("Loading base model");
    await loadTFJSModel("/static/models/tfjsmodel4");
    naturemodel = models[0];

    // Set up embeddings output
    natureModelEmbeddings = tf.model({
        inputs: naturemodel.inputs,
        outputs: [naturemodel.layers[39].output, naturemodel.layers[43].output, naturemodel.layers[46].output]
    });

    // Load in SVR
    console.log("Loading calibration model");
    svr_x_str = localStorage.getItem("svr_x");
    svr_y_str = localStorage.getItem("svr_y");
    svr_x = renewObject(JSON.parse(svr_x_str));
    svr_y = renewObject(JSON.parse(svr_y_str));

    // If there is no SVR, load in the default one and warn user
    if (svr_x_str == null || svr_y_str == null){
        console.log("WARNING: Loading default SVR, expect sub-par gaze tracking")
        let defaultSVR_str = await fetch("/static/models/defaultsvr.txt")
            .then(response => response.text())
            .then(data => data);

        defaultSVRs = JSON.parse(JSON.parse(defaultSVR_str))
        svr_x = renewObject(defaultSVRs[0])
        svr_y = renewObject(defaultSVRs[1])
    }

    // start the live loop
    done_with_training = true;
    curPred = [-1, -1];
    curPred2 = [-1, -1];
//    renderPrediction();
    setTimeout(function(){
            eyeSelfie(true);
        }, 1000);
    setTimeout(runSVRlive, 2000);

    ///////////// Setup for the playground page. Not used in other ones.
    // Resize the regression/classification toggle to look nice
    const regtoggle = document.getElementById('regtoggle');
    if (regtoggle != undefined){
        regtoggle.style.width = windowWidth + "px"
    }

    console.log("Gaze prediction setup complete");
}

