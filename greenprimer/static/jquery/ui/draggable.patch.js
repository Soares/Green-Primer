_generateposition:

            if(o.maxdist) {
                var par = this.element.parent().offset();
                var dx = pageX - this.offset.click.left - this.originalPosition.left - par.left;
                var dy = pageY - this.offset.click.top - this.originalPosition.top - par.top;
                var vector = new Vector(dx, dy);
                var origin = new Vector(0, 0);
                if(vector.distanceFrom(origin) > o.maxdist) {
                    var max = vector.unit().scale(o.maxdist);
                    pageX = this.originalPosition.left + par.left + this.offset.click.left + max.x;
                    pageY = this.originalPosition.top + par.top +  this.offset.click.top + max.y;
                }
            }
