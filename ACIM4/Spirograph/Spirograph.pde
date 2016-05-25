float cx, cy, rc, rm;
float x1, y1, x2, y2;

float rad = 0.0;

ArrayList<Point> arr = new ArrayList<Point>();

void setup(){
  size(400, 400);
  cx = width / 2;
  cy = height / 2;
  rc = 180.0;
  rm = 42.0;
  
  background(255);
  ellipse(cx, cy, rc * 2, rc * 2);
}

void draw(){
  
  background(255);
  stroke(0);
  ellipse(cx, cy, rc * 2, rc * 2);
  
  x1 = cx + (rc - rm) * cos(radians(rad));
  y1 = cy + (rc - rm) * sin(radians(rad));
  stroke(0);
  ellipse(x1, y1, rm * 2, rm * 2);
  
  x2 = x1 + rm * cos((rc - rm) / rm * radians(rad));
  y2 = y1 - rm * sin((rc - rm) / rm * radians(rad));
  //ellipse(x2, y2, 10, 10);
  stroke(255, 0, 0);
  line(x1, y1, x2, y2);
  arr.add(new Point(x2, y2));
  
  for(int i = 1; i < arr.size(); i++){
    //point(arr.get(i).x, arr.get(i).y);
    line(arr.get(i - 1).x, arr.get(i - 1).y, arr.get(i).x, arr.get(i).y);
  }
  
  rad = rad + 2.0;
}