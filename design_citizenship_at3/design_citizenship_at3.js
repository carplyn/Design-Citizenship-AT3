//Sketch based on "Type Class: Advanced Steering" and "Image Collage (Arrays)" by Andy Simionato and Karen Ann Donnachie. Coded with help from OpenCode.

let layer1Images = [];
let layer2Images = [];
let layer3Images = [];
let layer4Images = [];

let layer1Items = [];
let layer2Items = [];
let layer3Items = [];
let layer4Items = [];

let bodyFont;
let vehicles = [];
let currentSentenceIndex = 0;
let sentences = [];

const textOptions = {
  sampleFactor: 0.2,
  simplifyThreshold: 0
};

let leftBtn, rightBtn;

function preload() {
  for (let i = 0; i < 2; i++) {
    layer1Images.push(loadImage('data/layer1_' + i + '.png'));
    layer2Images.push(loadImage('data/layer2_' + i + '.png'));
    layer3Images.push(loadImage('data/layer3_' + i + '.png'));
    layer4Images.push(loadImage('data/layer4_' + i + '.png'));
  }
  bodyFont = loadFont('data/CirrusCumulus.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  let passage = `I acknowledge the Traditional Custodians of the land on which I live, work and study, the Wurundjeri Woi-wurrung and Bunurong peoples of the Eastern Kulin Nations. I recognise that sovereignty was never ceded and that this always was, and always will be, Aboriginal land. I pay my respects to Elders past and present, and extend that respect to all Aboriginal and Torres Strait Islander peoples. Moving from New Zealand to Australia, Melbourne initially felt surprisingly familiar, similar to New Zealand in so many ways. The friendliness of strangers, the warmth of community and an environment that reminded me of home. As time passed though, I began to notice the many differences in both nature and culture. The distinct smell and appearance of eucalyptus trees, waking up to the carolling of magpies and the vast scale of the land all made it clear that this place has its own identity and stories. Despite being one city, Naarm, Melbourne is made up of so many distinct suburbs, all with their own unique personalities and communities. Travelling through Naarm almost feels like exploring a whole country. Because I was so young when I lived in Auckland, my understanding of place was limited to a few familiar locations that my daily life revolved around. My favourite playground, the local mall, the dairy I'd pass on my way to school. Living in Naarm throughout the more formative years of my life has allowed me to experience and understand a place much more deeply. I distinctly remember learning about the Stolen Generations in primary school. I remember it being truly impactful and significant to learn about at such a young age. It taught me what colonisation is and how First Nations peoples have been, and continue to be, suppressed by the colonisers and governing bodies of this country. It made me aware that many of the opportunities and systems I benefit from today exist because of a history that has disadvantaged others. Since then, I have come to see that learning about this history is not something that happens once at school and is then complete. It is an ongoing responsibility. As a designer, my intention is to continue learning, listening and reflecting on my position in relation to Country and the people whose land I live, study and work on. I want to approach design with curiosity and humility, recognising that there are many ways of knowing, understanding and communicating that exist beyond the Western design traditions I have mostly been exposed to. I want to remain open to learning from different knowledge systems and to consider how design can create space for respect, connection and understanding. I believe there is still a great deal of progress to be made, both individually and collectively, in addressing the ongoing impacts of colonisation. We are all guests on this land. In Chinese culture, it is expected that you remove your shoes and show respect when entering someone else's home. I think of Country in a similar way. Living here comes with a responsibility to act with care, respect and gratitude. Through my design practice, I hope to continue building that relationship and contributing in ways that are thoughtful, respectful and informed.`;

  sentences = splitSentences(passage);
  generateCollage();
  showSentence(0);
}

function draw() {
  background(255);

  drawCollageItems(layer1Items);
  tint(255, 204);
  drawCollageItems(layer2Items);
  tint(255, 178);
  drawCollageItems(layer3Items);
  tint(255, 153);
  drawCollageItems(layer4Items);
  noTint();

  noStroke();
  fill(128, 128, 0, 128);
  rect(0, 0, width, height);

  for (let i = 0; i < vehicles.length; i++) {
    let v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }

  drawButtons();
}

function splitSentences(text) {
  let raw = text.replace(/\n/g, ' ').split(/(?<=\.) /);
  return raw.filter(s => s.trim().length > 0);
}

function showSentence(index) {
  currentSentenceIndex = (index + sentences.length) % sentences.length;
  generateWrappedParticles(sentences[currentSentenceIndex].trim());
}

function generateWrappedParticles(text) {
  vehicles = [];
  let fontSize = width / 18;
  let margin = width * 0.08;
  let maxWidth = width - margin * 2;
  let lineHeight = fontSize * 1.3;

  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    let testLine = currentLine + word + ' ';
    let bounds = bodyFont.textBounds(testLine, 0, 0, fontSize);
    if (bounds.w > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  let totalTextHeight = lines.length * lineHeight;
  let startY = (height - totalTextHeight) / 2 + lineHeight * 0.8;

  for (let i = 0; i < lines.length; i++) {
    let points = bodyFont.textToPoints(lines[i], margin, startY + i * lineHeight, fontSize, textOptions);
    for (let p of points) {
      let v = new Vehicle(p.x, p.y);
      vehicles.push(v);
    }
  }
}

function generateCollage() {
  layer1Items = generateCollageItems(layer1Images, 1, width / 2, height / 2, width / 3, height / 4, 0.15, 0.45, 0, PI);
  layer2Items = generateCollageItems(layer2Images, 1, width / 2, height / 2, width / 2, height / 3, 0.06, 0.3, -HALF_PI, HALF_PI);
  layer3Items = generateCollageItems(layer3Images, 1, width / 2, height / 2, width / 2, height, 0.12, 0.24, PI, HALF_PI);
  layer4Items = generateCollageItems(layer4Images, 1, width / 2, height / 2, width / 2, height / 3, 0.09, 0.27, 0, TWO_PI);
}

function generateCollageItems(imgArray, count, centerX, centerY, rangeX, rangeY, minScale, maxScale, minRotation, maxRotation) {
  let items = [];
  if (imgArray.length === 0) {
    console.warn("No images loaded for this layer!");
    return items;
  }
  for (let i = 0; i < count; i++) {
    let img = random(imgArray);
    let item = new CollageItem(img);
    item.x = centerX + random(-rangeX / 2, rangeX / 2);
    item.y = centerY + random(-rangeY / 2, rangeY / 2);
    item.rotation = random(minRotation, maxRotation);
    item.scaling = random(minScale, maxScale) * random(0.8, 1.2);
    items.push(item);
  }
  return items;
}

function drawCollageItems(items) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    push();
    translate(item.x, item.y);
    rotate(item.rotation);
    scale(item.scaling);
    image(item.image, 0, 0);
    pop();
  }
}

function CollageItem(image) {
  this.image = image;
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.scaling = 1;
}

function drawButtons() {
  let btnSize = 30;
  let y = height - 40;
  let leftX = width / 2 - 60;
  let rightX = width / 2 + 60;

  leftBtn = { x: leftX, y: y, size: btnSize };
  rightBtn = { x: rightX, y: y, size: btnSize };

  noStroke();
  fill(255, 180);
  drawArrow(leftBtn.x, leftBtn.y, btnSize, LEFT);
  if (currentSentenceIndex === sentences.length - 1) {
    drawRestartButton(rightBtn.x, rightBtn.y, btnSize);
  } else {
    drawArrow(rightBtn.x, rightBtn.y, btnSize, RIGHT);
  }
}

function drawRestartButton(cx, cy, size) {
  push();
  translate(cx, cy);
  noStroke();
  fill(255, 180);
  let s = size * 0.35;
  triangle(-s, -s * 0.1, 0, -s * 0.85, s, -s * 0.1);
  rect(-s, -s * 0.1, s * 2, s * 1.1);
  rect(-s * 0.25, s * 0.25, s * 0.5, s * 0.75);
  pop();
}

function drawArrow(cx, cy, size, dir) {
  push();
  translate(cx, cy);
  if (dir == LEFT) {
    triangle(size / 2, -size / 2, -size / 2, 0, size / 2, size / 2);
  } else {
    triangle(-size / 2, -size / 2, size / 2, 0, -size / 2, size / 2);
  }
  pop();
}

function mousePressed() {
  if (leftBtn && mouseX > leftBtn.x - leftBtn.size && mouseX < leftBtn.x + leftBtn.size &&
      mouseY > leftBtn.y - leftBtn.size && mouseY < leftBtn.y + leftBtn.size) {
    generateCollage();
    showSentence(currentSentenceIndex - 1);
  } else if (rightBtn && mouseX > rightBtn.x - rightBtn.size && mouseX < rightBtn.x + rightBtn.size &&
             mouseY > rightBtn.y - rightBtn.size && mouseY < rightBtn.y + rightBtn.size) {
    generateCollage();
    if (currentSentenceIndex === sentences.length - 1) {
      showSentence(0);
    } else {
      showSentence(currentSentenceIndex + 1);
    }
  } else {
    generateCollage();
  }
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    let fileName = 'collage_' + year() + month() + day() + "_" + hour() + minute() + second();
    saveCanvas(fileName, 'jpg');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCollage();
  showSentence(currentSentenceIndex);
}

class Vehicle {
  constructor(targetX, targetY) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(targetX, targetY);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 5;
    this.maxForce = 0.3;
    this.dotSize = 4;
  }

  behaviors() {
    let arriveForce = this.calculateArrive(this.target);
    let mousePos = createVector(mouseX, mouseY);
    let fleeForce = this.calculateFlee(mousePos);
    arriveForce.mult(1);
    fleeForce.mult(5);
    this.applyForce(arriveForce);
    this.applyForce(fleeForce);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  show() {
    stroke(255);
    strokeWeight(this.dotSize);
    point(this.pos.x, this.pos.y);
  }

  calculateArrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  calculateFlee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < 50) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
