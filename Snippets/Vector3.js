function Vector3(x,y,z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

    var deg = function(rad) {return rad*180/Math.PI;};
    var rad = function(deg) {return deg*Math.PI/180;};
    var cos = function(deg) {return Math.cos(rad(deg));};
    var sin = function(deg) {return Math.sin(rad(deg));};
 
    /* Applying rotation
       X: X rotation value in degrees
       Y: Y rotation value in degrees
       Z: Z rotation value in degrees
       [v]: Vector to rotate about, empty: (0,0,0)
        
       Applying rotation calculations in the order z y x
    */
    this.rotate = function(X,Y,Z,v) {
        if(v) {
            this.calc("-", v);
            this.rotate(X,Y,Z);
            this.calc("+", v);
        } else {
            var rotZ = function() {
                var x = this.x; var y = this.y; var z = this.z;
                this.x = x*cos(Z) - y*sin(Z);
                this.y = x*sin(Z) + y*cos(Z);
            };
              
            var rotY = function() {
                var x = this.x; var y = this.y; var z = this.z;
                this.x =  x*cos(Y) + z*sin(Y);
                this.z = -x*sin(Y) + z*cos(Y);
            };
              
            var rotX = function() {
                var x = this.x; var y = this.y; var z = this.z;
                this.y = y*cos(X) - z*sin(X);
                this.z = y*sin(X) + z*cos(X);
            };
            
            rotZ(); rotY(); rotX();
        }
    };
      
    /* A method to do vector calculaions without return on
       +, -, *, / 
    */
    this.calc = function(expr, v) {
        if(expr == "+") {
            this.x += v.x; this.y += v.y; this.z += v.z;
        } else if(expr == "-") {
            this.x -= v.x; this.y -= v.y; this.z -= v.z;
        } else if(expr == "*") {
            this.x *= v; this.y *= v; this.z *= v;
        } else if(expr == "/") {
            this.x /= v; this.y /= v; this.z /= v;
        } else if(expr == ".") {
            return this.x*v.x + this.y*v.y + this.z*v.z;
        } else if(expr == "x") {
            return new Vector3(
                this.y*v.z - v.y*this.z,
                this.z*v.x - v.z*this.x,
                this.x*v.y - v.x*this.y);
        }
    };
      
    /* Calculations applied to a new vector -> return value */
    this.add = function(v) {
        return new Vector3(this.x+v.x,this.y+v.y,this.z+v.z);
    };
    
    this.sub = function(v) {
        return new Vector3(this.x-v.x,this.y-v.y,this.z-v.z);
    };
    
    this.mult = function(a) {
        return new Vector3(a*this.x, a*this.y, a*this.z);
    };
      
    /* Returns a copy of the vector */
    this.get_copy = function() {return new Vector3(this.x,this.y,this.z);};
      
    /* Returns the magnitude of a vector */
    this.get_length = function() {
        return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)+
                         Math.pow(this.z,2));
    };
      
    /* Returns a normalized vector (length = 1) */
    this.get_norm = function() {
        let l = this.get_length();
        return new Vector(this.x/l,this.y/l,this.z/l);
    };
      
    /* Return the angle between two vectors (rad) */
    this.angle_to = function(v) {
        return Math.acos(this.calc(".",v) / 
                        (this.get_length() * v.length));
    };
}
