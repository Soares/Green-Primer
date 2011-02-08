var elements = function(self) {
    var id = 1;

    self.all = [];

    self.register = function(object, ident) {
        object.id = ident || (id++);
        self.all.push(object);
        return object;
    };

    self.forget = function(object) {
        for(var i = 0; i < self.all.length; i++) {
            if(object.is(self.all[i])) break;
        }
        self.all.splice(i, 1);
    };

    self.find = function(id) {
        for(var i = 0; i < self.all.length; i++) {
            if(self.all[i].id === id && self.all[i].isReal()) {
                return self.all[i];
            }
        }
    };

    return self;
};

var Elem = function(type, group, binding) {
    type.prototype.init = function(id) {
        group.register(this, id);
        this.$.data('id', this.id);
    };

    type.prototype.dump = function() {
        return {
            group: group,
            creator: type,
            id: this.id,
            object: this.serialize.apply(this, arguments),
        };
    };

    /* Universal Functions */
    type.prototype.is = function(other) {
        return this.id === other.id;
    };

    /* Placeholding */
    type.prototype.placehold = function() {
        this.$.addClass('surreal');
        return this;
    };
    type.prototype.graduate = function() {
        this.$.removeClass('surreal');
        return this;
    };
    type.prototype.isReal = function() {
        return this.$.is(':not(.surreal)');
    };

    return type;
};
Elem.load = function(dump) {
    return dump.group.find(dump.id) || dump.creator.deserialize(dump.object, dump.id);
};
