/* 
    GXTML.js - v0.1.0 Beta
    
    Game Cross-Type Markup Language 
    ~ HTML-DOM Based Lightweight Game Engine ~

    OpenSource - Licensed under The MIT License
    ~ https://github.com/equneko/gxtml ~
*/

/* 
    @GXTMLMain - Invoked function
    @param {win, nav, doc} as window, navigator, document
*/
(function _GXTML_Main_(win, nav, doc) {

    /* 
        @GXTML - object
        - @NAME - string
        - @VERSION - string
        - @WIDTH - number
        - @HEIGHT - number
        - @TYPE - string
        - @create() - function@GXTMLGame
        - @object() - function@GXTMLObject
        - @rect() - function@GXTMLObject
        - @circle() - function@GXTMLObject
        - @dom() - function@GXTMLObject
        - @size() - function
    */
    window.GXTML = {
        NAME: 'GXTML',
        VERSION: '0.1.0 Beta',
        WIDTH: win.innerWidth,
        HEIGHT: win.innerHeight,
        TYPE: nav.userAgent,

        /* 
            @create - a main game procedure
            @param {game} as object of procedure
        */
        create: function (game) {
            if (!game) return null;

            /* Initialize <body> manipulation become a canvas */
            var view = doc.body, frame = null, i, j;
            _$(view).width = '100%';
            _$(view).height = '100%';
            _$(view).margin = '0';
            _$(view).padding = '0';

            /* Identification canvas */
            if (game.id) {
                view = doc.body.querySelector("#" + game.id);
                if (view == null) view = doc.body;
            }
            // make fixed for flow top layers
            _$(view).position = 'fixed';

            // set @GXTMLGame into unique id
            game._GXTML_Game_ = "game" + Math.random();
            // give spesific id into canvas
            game.id = game.id ? game.id : '';
            // define DOM by view defined at top
            game.view = view;
            // list @GXTMLObject in @GXTMLGame
            game.object = [];
            // adding @GXTMLObject in @GXTMLGame
            game.add = function (object) {
                if (object._GXTML_Object_) {
                    game.object.push(object);

                    game.view.insertBefore(object.V,
                        game.view.querySelectorAll('script')[0]);
                }
            };
            // get @GXTMLObject in @GXTMLGame by id
            game.get = function (id) {
                if (typeof id == 'string') {
                    for (var i in game.object) {
                        if (game.object[i].id == id)
                            return game.object[i];
                    }
                } else {
                    return game.object[id];
                }
            },
            // list of @GXTMLObject from @GXTMLGame
            game.each = function (fn) {
                for (var o in game.object) {
                    fn(game.object[o]);
                }
            },
            // delete @GXTMLObject from @GXTMLGame
            game.del = function (object) {
                game.object.splice(object, 1);
                view.removeChild(object.V);
            };
            // initialize @GXTMLGame
            game.init = function () {
                _$(doc.body).backgroundColor = game.color ? game.color : 'black';
                if (game.background && typeof game.background == 'string') {
                    game.add(GXTML.object({
                        _GXTML_Background_: true,
                        x: 0, y: 0, width: GXTML.WIDTH, height: GXTML.HEIGHT,
                        sprite: game.background
                    }));
                }
            };
            // start/resume @GXTMLGame
            game.start = function () {
                return game.stucked == false;
            };
            // stop/pause @GXTMLGame
            game.stop = function () {
                return game.stucked == true;
            };
            // give @EventListener into @GXTMLGame based on @window
            game.on = function (event, fn) {
                return win.addEventListener(event, fn);
            };
            // destroy @GXTMLGame with all procedural
            game.destroy = function () {
                game.object = [];
                clearInterval(frame);
                for (var c in view.children) {
                    view.removeChild(view.children[c]);
                }
                if (game.dispose) game.dispose();
            };

            // check if @orientation defined then detect it
            if (game.orientation) {
                if (game.orientation == 'portrait') {
                    if (game.width > game.height) {
                        alert("GXTML - Error:\nGame Only Support Portrait!");
                        return null;
                    }
                } else {
                    if (game.width < game.height) {
                        alert("GXTML - Error:\nGame Only Support Landscape!");
                        return null;
                    }
                }
            }

            // first @GXTMLGame initialization sector
            game.init();

            // adding in game detection @GXTMLObject listed on @GXTMLGame
            for (i in game) {
                game.add(game[i]);
            }

            // @HTMLDOM feature to detect @GXTMLObject with <GXTML></GXTML> Element
            var GXTMLMain = doc.body.querySelector('gxtml[' + game.id + ']'),
                obj = GXTML.children ? Array.from(GXTMLMain.children).reverse() : null;
            if (GXTMLMain != null) {
                var i, j, gobj = null, prop = {};
                for (i in obj) {
                    if (obj[i].constructor.toString().includes("Element")) {
                        for (j in obj[i].attributes) {
                            prop[obj[i].attributes[j].name] = obj[i].attributes[j].value;
                        }
                        gobj = GXTML.object(prop);
                        game[obj[i].tagName.toLowerCase()] = gobj;
                        game.add(gobj);
                    }
                }
                GXTMLMain.remove();
            }

            // @setup listener on @GXTMLGame for prepare something before started game
            if (game.setup) game.setup(game);

            // @update listener on @GXTMLGame for manipulate something after started game
            frame = setInterval(function () {
                if (game.stucked) return;
                var obj, i;
                for (i in game.object) {
                    obj = game.object[i];
                    obj._GXTML_Object_();
                    /* 
                    NOT RELEASED :v
                    if (game.gravity) {
                        if (obj.mass != 0) {
                            if (i < (game.object.length - 1)) {
                                for (j in game.object) {
                                    if (obj.x != game.object[j].x) {
                                        if (!obj.collide(game.object[j])) {
                                            obj.x += game.gravity[0] * obj.mass;
                                            obj.y += game.gravity[1] * obj.mass;
                                        }else{
                                            obj.velY = 0;
                                        }
                                    }
                                }
                            }
                        }
                    } */
                }
                if (game.update) game.update(game);
            }, 1);

            // record @MouseEvent into @GXTML.mouseX and @GXTML.mouseY
            if (GXTML.mouseX == null && GXTML.mouseY == null) {
                game.on('mousemove', function (e) {
                    win.GXTML.mouseX = e.clientX;
                    win.GXTML.mouseY = GXTML.HEIGHT - e.clientY;
                });
            }

            return game; // return @GXTMLGame (object)
        },

        /* 
            @object - a game object for @GXTMLGame
            @param {prop} as property of object
        */
        object: function (prop) {
            if (!prop) return null;

            // define @object by @prop param
            var object = {
                V: prop.V ? prop.V : doc.createElement('div'),
                x: prop.x ? prop.x : 0, velX: 0,
                y: prop.y ? prop.y : 0, velY: 0,
                rotate: prop.rotate ? prop.rotate : 0,
                flipX: prop.flipX ? prop.flipX : 1,
                flipY: prop.flipY ? prop.flipY : 1,
                width: prop.width ? prop.width : 0,
                height: prop.height ? prop.height : 0,
                bound: prop.bound ? prop.bound : [0, 0],
                // mass: prop.mass ? prop.mass : 0, NOT RELEASED
                color: prop.color ? prop.color : '',
                border: prop.border ? prop.border : '',
                corner: prop.corner ? prop.corner : '0',
                sprite: prop.sprite ? prop.sprite : '',
                CSS: prop.CSS ? prop.CSS : '',

                // define function @GXTMLObject to update all interaction
                _GXTML_Object_: function () {
                    var trans = 'translate(x,y) rotate(deg) scaleX(flipX) scaleY(flipY)';

                    if (this.velX != 0)
                        this.x += this.velX;
                    if (this.velY != 0)
                        this.y += this.velY;

                    _$(this.V).transform = trans
                        .split('x').join(this.x + 'px')
                        .split('y').join((this.y * -1) + (GXTML.HEIGHT - this.height) + 'px')
                        .split('deg').join(this.rotate + 'deg')
                        .split('flipX').join(this.flipX)
                        .split('flipY').join(this.flipY);

                    _$(this.V).width = this.width + 'px';
                    _$(this.V).height = this.height + 'px';
                    if (this.color != '') _$(this.V).backgroundColor = this.color;
                    if (this.border != '') _$(this.V).border = '1px solid ' + this.border;
                    if (this.corner != '') _$(this.V).borderRadius = this.corner + 'px';

                    if (this.sprite != '') {
                        _$(this.V).backgroundImage = 'url(' + this.sprite + ')';
                        _$(this.V).backgroundSize = 'cover';
                        _$(this.V).backgroundPosition = 'center';
                    }

                    if (this.CSS != '') {
                        var getCSS = this.V.getAttribute('style');
                        if (getCSS != null)
                            this.V.setAttribute('style', getCSS + this.CSS);
                    }

                    if (this.update) this.update();
                },

                // create object by default (after destroyed)
                create: function (game) {
                    if (!this.isDestroyed) return;
                    delete this.isDestroyed;

                    game.add(this);
                },

                // give identification on @GXTMLObject
                id: function (id) {
                    if (id) this.V.id = id;
                    return this;
                },

                // give @EventListener on @GXTMLObject
                on: function (event, fn) {
                    var self = this;
                    this.V.addEventListener(event,
                        function (e) { fn(self, e) }
                    );
                    return this;
                },

                // set visibility show/hide @GXTMLObject
                visible: function (visibility) {
                    this.isVisible = visibility;
                    if (visibility) {
                        _$(this.V).display = '';
                    } else {
                        _$(this.V).display = 'none';
                    }
                },

                // check if @GXTMLObject is visible or not
                isVisible: true,

                // animate @GXTMLObject by sprites
                anim: function (sprites, length, frame) {
                    if (this.anim['f' + frame] != null) {
                        if (this.anim['f' + frame] < (frame * 10))
                            this.anim['f' + frame]++;
                    } else {
                        this.anim['f' + frame] = 0;
                    }
                    if (this.anim.index != null) {
                        if (this.anim['f' + frame] == (frame * 10)) {
                            if (this.anim.index < length) {
                                this.anim['f' + frame] = 0;
                                this.sprite = sprites.split('$').join(this.anim.index);
                                this.anim.index++;
                            }
                            else {
                                this.anim.index = 0;
                            }
                        }
                    } else {
                        this.anim.index = 0;
                    }
                    return this;
                },

                // detect collision collider between @GXTMLObject
                collide: function (object) {
                    var self = this, selfBound = self.V.getBoundingClientRect(),
                        objectBound = object.V.getBoundingClientRect(),

                        result = (objectBound.bottom - object.bound[1]) > (selfBound.top + self.bound[1])
                            && (objectBound.right - object.bound[0]) > (selfBound.left + self.bound[0])
                            && (objectBound.top + object.bound[1]) < (selfBound.bottom - self.bound[1])
                            && (objectBound.left + object.bound[0]) < (selfBound.right - self.bound[0]);

                    this.isCollided = result;

                    return result;
                },

                // check if @GXTMLObject is collided (collision) by another object
                isCollided: false,

                // move @GXTMLObject by velocity {X, Y}
                move: function (velX, velY) {
                    if (velX != 0) this.velX = velX;
                    if (velY && velY != 0) this.velY = velY;

                    return this;
                },

                // following pointer into @GXTMLObject
                follow: function (pointX, pointY, block) {
                    var x = pointX - (this.width / 2),
                        y = pointY - (this.height / 2);

                    // if @block param has defined, return point, skip following.
                    if (block) return { x: x, y: y };

                    this.x = x;
                    this.y = y;

                    return this;
                },

                // destroy @GXTMLObject then make sure not listed on @GXTMLGame
                destroy: function (game) {
                    if (this.isDestroyed) return;
                    this.isDestroyed = true;

                    game.del(this);
                },

            };

            // initialize interaction
            _$(object.V).position = 'fixed';
            if (prop.id) object.V.id = prop.id;
            object._GXTML_Object_();

            return object;
        },

        /* 
            @rect - @GXTMLObject-based for rectangle shape
            @param {x, y, width, height, prop}
                as position, size, custom_property
        */
        rect: function (x, y, width, height, prop) {
            if (prop == null) prop = {};
            prop.x = x;
            prop.y = y;
            prop.width = width;
            prop.height = height;

            return this.object(prop);
        },

        /* 
            @circle - @GXTMLObject-based for circle shape
            @param {x, y, size, prop}
                as position, size, custom_property
        */
        circle: function (x, y, size, prop) {
            if (prop == null) prop = {};
            prop.x = x;
            prop.y = y;
            prop.width = size;
            prop.height = size;
            prop.corner = '100';

            return this.object(prop);
        },

        /* 
            @dom - @GXTMLObject-based for @HTMLDOM
            @param {x, y, dom, prop}
                as position, element, custom_property
        */
        dom: function (x, y, width, height, dom, prop) {
            if (prop == null) prop = {};

            var dom = typeof dom == 'string' ? doc.querySelector(dom) : dom, root, i;

            prop.x = x;
            prop.y = y;
            prop.width = width;
            prop.height = height;

            root = this.object(prop);
            if (dom.constructor == Array) {
                for (i in dom) {
                    root.V.appendChild(dom[i]);
                }
            } else {
                root.V.appendChild(dom);
            }

            return root;
        },

        /* 
            @size - extra function for do responsive size
            @param {sizeX, sizeY} for define @WIDTH or @HEIGHT size
        */
        size: function (sizeX, sizeY) {
            if (sizeX && sizeY && sizeX > 0) {
                GXTML.sizeX = sizeX;
                GXTML.sizeY = sizeY;
            } else {
                if (sizeY) {
                    return GXTML.HEIGHT / (GXTML.sizeY / sizeY);
                } else {
                    return GXTML.WIDTH / (GXTML.sizeX / sizeX);
                }
            }
        }

    };

    // internal function @_$ for do CSS-Manipulation on DOM
    function _$(object) {
        return object.style;
    }

})(window, navigator, document);