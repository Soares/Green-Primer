var fluids = (function(self) {
    // Physics
    self.GRAVITY = new Vector(0, -9.81);
    self.DENSITY_OFFSET = 100;
    self.GAS_K = 0.1;
    self.VISCOSITY = 0.002;
    self.SIM_DOMAIN = new Rectangle(.1, .1, 6.1, 6.1);
    self.CELL_SPACE = (self.SIM_DOMAIN.width + self.SIM_DOMAIN.height) / 64;
    self.DELTA_TIME_SEC = 0.01;
    self.PARTICLE_MASS = self.CELL_SPACE * 20;

    // Common
    self.PRIME_1 = 73856093;
    self.PRIME_2 = 19349663;
    self.PRIME_3 = 83492791;
    self.FLOAT_EPSILON = 1.192092896e-07f;

    return self;
})(fluids || {});
