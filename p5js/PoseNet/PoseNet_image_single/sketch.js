let img;
let poseNet;
let poses = [];

function setup() {
    createCanvas(640, 360);

    // create an image using the p5 dom library
    // call modelReady() when it is loaded
    img = createImg('data/runner.jpg', imageReady);
    // set the image size to the size of the canvas
    img.size(width, height);

    img.hide(); // hide the image in the browser
    frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

// when the image is ready, then load up poseNet
function imageReady(){
    // set some options
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1
    }
    
    // assign poseNet
    poseNet = ml5.poseNet(modelReady, options);
}

// when poseNet is ready, do the detection
function modelReady() {
    select('#status').html('Model Loaded');


    // TODO: add support for callback - https://github.com/ml5js/ml5-examples/issues/80
    // call the single pose on our image
    // poseNet.singlePose(img, function(err, res) {
    //     if(err) return err
    //     // when we get a response, store the results to our poses[] array
    //     // then draw will do it's thing
    //     console.log(res)
    //     poses = res;
    // });


    // // call the single pose on our image
    poseNet.singlePose(img).then( (res) => {
        // when we get a response, store the results to our poses[] array
        // then draw will do it's thing
        poses = res;
    }).catch( (err) => {
        return err;
    });

}

// draw() will not show anything until poses are found
function draw() {
    if (poses.length > 0) {
        image(img, 0, 0, width, height);
        drawSkeleton(poses);
        drawKeypoints(poses);
        noLoop(); // stop looping when the poses are estimated
    }

}

// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
