_generateposition:

            if(o.maxdist) {
                var par = this.element.parent().offset();
                var dx = pageX - this.offset.click.left - this.originalPosition.left - par.left;
                var dy = pageY - this.offset.click.top - this.originalPosition.top - par.top;
                console.log(dx, dy);
                var vector = $V([dx, dy]);
                var origin = $V([0, 0]);
                if(vector.distanceFrom(origin) > o.maxdist) {
                    var max = vector.toUnitVector().multiply(o.maxdist);
                    pageX = this.originalPosition.left + par.left + this.offset.click.left + max.elements[0];
                    pageY = this.originalPosition.top + par.top +  this.offset.click.top + max.elements[1];
                }
            }
