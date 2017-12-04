var app = angular.module('myApp', ['ui.bootstrap', 'ngAnimate']);
app.controller('MyCtrl', function ($scope, $window, $http, $log, $uibModal) {
    var vm = this;
    
    vm.searchText = "";
    vm.svi_filmovi = [];
    vm.filmovi = [];
    vm.loginIme = "";
    vm.loginLozinka = "";
    vm.signupIme = "";
    vm.signupLozinka = "";
    vm.ponovljenaLozinka = "";
    vm.ulogovanoIme = "";
    vm.korisnici = [];
    vm.msg = "";
    vm.info = false;
    vm.searchKorisnike = "";
    vm.prikaz = 4;
    vm.showLogin = true;
    vm.showRegistracija = true;
    vm.showKorisnickoIme = false;
    vm.showDetaljnije = false;
    vm.showFilmove = true;
    vm.showPagination = true;
    vm.showPoruke = false;
    vm.formatDatuma = "dd-MMM-yyyy";
    vm.datum = new Date();
    vm.porukeNiz = [];
    vm.maxPopularity = 0;
    vm.minPopularity = 0;
    vm.razlika = 0;
    vm.zanrovi = [
        {"id": 12, "name": "Adventure"},
        {"id": 28, "name": "Action"},
        {"id": 14, "name": "Fantasy"},
        {"id": 878, "name": "Science Fiction"},
        {"id": 53, "name": "Thriller"},
        {"id": 10751, "name": "Family"},
        {"id": 10749, "name": "Romance"},
        {"id": 35, "name": "Comedy"}
    ];
    vm.totalItems;
    vm.itemsPerPage = 4;
    vm.currentPage = 1;
    vm.maxSize = 5;

    vm.poruke = function () {
        for (var i in vm.korisnici) {
            if (vm.ulogovanoIme == vm.korisnici[i].ime) {
                if (vm.korisnici[i].poruke.length > 0) {
                    for (var j in vm.korisnici[i].poruke) {
                        vm.porukeNiz.push(vm.korisnici[i].poruke[j]);
                    }
                    vm.showFilmove = false;
                    vm.showPagination = false;
                    vm.showPoruke = true;
                } else {
                    $scope.alerts.push({type: 'info', msg: 'Nemate poruka u sanducetu'});
                }
            }
        }
        console.log(vm.porukeNiz);
    };

    $scope.alerts = [
    ];

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };


    vm.filter = function (el) {
        vm.showFilmove = true;
        vm.showPagination = true;
        vm.showPoruke = false;
        if (el == 'all') {
            vm.totalItems = vm.svi_filmovi.length;
            vm.filmovi = vm.svi_filmovi;
        } else if (el == 'omiljeni') {
            var lista = [];
            for (var i in vm.svi_filmovi) {
                if (vm.svi_filmovi[i].favorit == true) {
                    lista.push(vm.svi_filmovi[i]);
                }
            }
            vm.totalItems = lista.length;
            vm.filmovi = lista;
        } else if (el == "jakoDobar") {
            var lista = [];
            for (var i in vm.svi_filmovi) {
                var film = vm.svi_filmovi[i];
                if (film.rate == "jako dobar") {
                    lista.push(film);
                }
            }
            vm.totalItems = lista.length;
            vm.filmovi = lista;
        } else if (el == "dobar") {
            var lista = [];
            for (var i in vm.svi_filmovi) {
                var film = vm.svi_filmovi[i];
                if (film.rate == "dobar") {
                    lista.push(film);
                }                                    
            }
            vm.totalItems = lista.length;
            vm.filmovi = lista;
        } else if (el == "los") {
            var lista = [];
            for (var i in vm.svi_filmovi) {
                var film = vm.svi_filmovi[i];
                if (film.rate == "los") {
                    lista.push(film);
                }
            }
            vm.totalItems = lista.length;
            vm.filmovi = lista;
        } else if (el == 'pretrage') {
            var lista = [];
                for (var i in vm.svi_filmovi) {
                    var film = vm.svi_filmovi[i];
                    film.favorit = false;
                    if (film.title.toLowerCase().indexOf(vm.searchText.toLowerCase()) != -1) {
                        lista.push(film);
                    }
                }
                vm.totalItems = lista.length;
                vm.filmovi = lista;
        } else {
            console.log("usao je u else");
            var lista = [];
            for (var i in vm.svi_filmovi) {
                var film = vm.svi_filmovi[i];
                for (var j in film.genres) {
                    if (film.genres[j].name == el.name) {
                        lista.push(film);
                        break;
                    }
                }                                
            }
            vm.totalItems = lista.length;
            vm.filmovi = lista;
        }
    };

    vm.init = function () {
        var req = {
            method: "GET",
//            url: "http://88.99.171.79:8080/filmovi?search=" + vm.searchText
            url: "filmovi.json"
        };
        $http(req).then(
                function (resp) {
                    console.log(resp);
                    var lista = [];
                    vm.svi_filmovi = resp.data.filmovi;
                    for (var i in vm.svi_filmovi) {
                        var film = vm.svi_filmovi[i];
                        film.favorit = false;
                        
                            lista.push(film);
                        
                    }
                    vm.totalItems = lista.length;
                    vm.filmovi = lista;
                    console.log(vm.filmovi);                   
                    vm.maxPopularity = vm.filmovi[0].popularity;
                    vm.minPopularity = vm.filmovi[0].popularity;
                }, function (resp) {
            vm.message = 'error';
        });
    };

    vm.set_favorit = function (el) {
        if (vm.ulogovanoIme == "") {
            $scope.alerts.push({type: 'warning', msg: 'Ne mozete ubacivati u favorite ukoliko niste ulogovani'});
        } else {
            for (var i in vm.korisnici) {
                if (vm.loginIme == vm.korisnici[i].ime) {
                    vm.korisnici[i].favoriti = el.title;
                }
            }
            el.favorit = !el.favorit;
            if (el.favorit == true) {
                $scope.alerts.push({type: 'success', msg: 'Film prebacen u grupu omiljenih'});
            } else {
                $scope.alerts.push({type: 'danger', msg: 'Film vise nije omiljen'});
            }

            var data = {
                'imdb_id': el.imdb_id,
                'title': el.title
            };
            var req = {
                method: "POST",
                data: el,
                url: "http://88.99.171.79:8080/favorit"
            };
            $http(req).then(
                    function (resp) {
                        console.log(resp);
                    }, function (resp) {
                vm.message = 'error';
            });
        }
    };

    vm.init();

    vm.showRegisterModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'registerModal.html',
            controller: function ($uibModalInstance, parent) {
                var $ctrl = this;
                $ctrl.signupIme = "";
                $ctrl.signupLozinka = "";
                $ctrl.ponovljenaLozinka = "";
                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                console.log(parent.korisnici);
                $ctrl.registracija = function () {
                    var imeZauzeto = false;
                    console.log($ctrl.signupIme, $ctrl.signupLozinka);
                    for (var i in parent.korisnici) {
                        if ($ctrl.signupIme == parent.korisnici[i].ime) {
                            imeZauzeto = true;
                        }
                    }
                    if (imeZauzeto) {
                        $scope.alerts.push({type: 'danger', msg: 'Korisnicko ime je zauzeto'});
                        return;
                    }

                    if ($ctrl.signupIme == "" || $ctrl.signupLozinka == "" || $ctrl.ponovljenaLozinka == "") {
                        $scope.alerts.push({type: 'warning', msg: 'Morate popuniti sva polja'});
                    } else if ($ctrl.signupLozinka == $ctrl.ponovljenaLozinka) {
                        $scope.alerts.push({type: 'success', msg: 'Uspesno ste se registrovali'});
                        parent.korisnici.push({ime: $ctrl.signupIme, lozinka: $ctrl.signupLozinka, poruke: [], favoriti: []});
                        $uibModalInstance.dismiss('cancel');
                    } else {
                        $scope.alerts.push({type: 'danger', msg: 'Lozinka i ponovljena lozinka moraju biti iste'});
                    }
                    console.log(parent.korisnici);
                };
            },
            controllerAs: '$ctrl',
            resolve: {
                parent: function () {
                    return vm;
                }
            }
        });

        modalInstance.result.then(function (signupIme, signupLozinka, ponovljenaLozinka) {

        }, function () {
            console.log('modal-component dismissed at: ' + new Date());
        });
    };

    vm.showLoginModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginModal.html',
            controller: function ($uibModalInstance, parent) {
                var $ctrl = this;
                $ctrl.loginIme = "";
                $ctrl.loginLozinka = "";
                $ctrl.ulogovanoIme = "";

                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $ctrl.login = function () {
                    if ($ctrl.loginIme == "" || $ctrl.loginLozinka == "") {
                        $scope.alerts.push({type: 'warning', msg: 'Morate popuniti sva polja'});
                    }

                    var brojac = 0;
                    for (var i in parent.korisnici) {
                        if ($ctrl.loginIme == parent.korisnici[i].ime) {
                            brojac++;
                        }
                    }
                    if (brojac == 0) {
                        $scope.alerts.push({type: 'danger', msg: 'Korisnik nije registrovan'});
                        console.log("Korisnik nije registrovan");
                        return;
                    }

                    console.log("Korisnik postoji u bazi");
                    console.log(parent.korisnici);
                    var pogresnaLozinka = false;
                    for (var i in parent.korisnici) {
                        if ($ctrl.loginIme == parent.korisnici[i].ime && $ctrl.loginLozinka != parent.korisnici[i].lozinka) {
                            $scope.alerts.push({type: 'danger', msg: 'Pogresna lozinka'});
                            pogresnaLozinka = true;
                        }
                    }
                    if (pogresnaLozinka) {
                        console.log("Pogresna lozinka");
                        return;
                    }

                    console.log("Lozinka je uredu");
                    if ($ctrl.loginIme == "" || $ctrl.loginLozinka == "") {
                        $scope.alerts.push({type: 'warning', msg: 'Morate popuniti sva polja'});
                    } else {
                        for (var i in parent.korisnici) {
                            if ($ctrl.loginIme == parent.korisnici[i].ime && $ctrl.loginLozinka == parent.korisnici[i].lozinka) {
                                $scope.alerts.push({type: 'success', msg: $ctrl.loginIme + ' se uspesno ulogovao/la'});
                                $uibModalInstance.dismiss('cancel');
                                parent.showLogin = false;
                                parent.showKorisnickoIme = true;
                                parent.ulogovanoIme = $ctrl.loginIme;
                                parent.showRegistracija = false;
                                console.log(parent.ulogovanoIme);
                            }
                        }
                    }

                    
                    for (var i in parent.korisnici) {
                        if (vm.ulogovanoIme == vm.korisnici[i].ime) {
                            if (vm.korisnici[i].poruke.length > 0) {
                                $scope.alerts.push({type: 'info', msg: 'Imate novu poruku'});
                            }
                        }
                    }
                };

            },
            controllerAs: '$ctrl',
            resolve: {
                parent: function () {
                    return vm;
                }
            }
        });
        modalInstance.result.then(function (username) {

        }, function () {
            console.log('modal-component dismissed at: ' + new Date());
        });
    };


    vm.logout = function () {
        vm.loginIme = "";
        vm.ulogovanoIme = "";
        vm.loginLozinka = "";
        vm.showLogin = true;
        vm.showKorisnickoIme = false;
        vm.showRegistracija = true;
        $scope.alerts.push({type: 'info', msg: 'Uspesno ste se izlogovali. Hvala Vam sto ste koristili nasu aplikaciju'});
    };


    vm.prikaziShareModal = function (el) {
        if (vm.ulogovanoIme == "") {
            $scope.alerts.push({type: 'warning', msg: 'Ne mozete share-ovati ukoliko niste ulogovani'});
        } else {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'shareModal.html',
                controller: function ($uibModalInstance, movie, parent) {
                    var $ctrl = this;
                    $ctrl.searchKorisnike = "";
                    $ctrl.korisnici = parent.korisnici;
                    $ctrl.imeFilma = movie.title;
                    $ctrl.linkFilma = "http://www.imdb.com/title/" + movie.imdb_id + "/";
                    console.log($ctrl.imeFilma, $ctrl.linkFilma);
                    $ctrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $ctrl.share = function (el) {
                        var posiljalac = vm.ulogovanoIme;
                        el.poruke.push({posiljalac: posiljalac, part1: 'Pronasao/la sam ', part2: $ctrl.linkFilma, part3: $ctrl.imeFilma, part4: ' film na Singi-Movies App, preporucujem ti da ga pogledas'});
                        console.log(el.poruke[0]);
                        $scope.alerts.push({type: 'success', msg: 'Vas share je uspesno prosledjen'});

                    };
                },
                controllerAs: '$ctrl',
                resolve: {
                    movie: function () {
                        return el;
                    },
                    parent: function () {
                        return vm;
                    }
                }
            });

            modalInstance.result.then(function (username) {

            }, function () {
                console.log('modal-component dismissed at: ' + new Date());
            });
        }
    };

    vm.edit = function (el) {
        if (vm.ulogovanoIme == "") {
            $scope.alerts.push({type: 'warning', msg: 'Ne mozete edit-ovati film ukoliko niste ulogovani'});
        } else {
            console.log(el);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editModal.html',
                controller: function ($uibModalInstance, movie, parent) {
                    var $ctrl = this;
                    $ctrl.formatDatuma = parent.formatDatuma;
                    $ctrl.datum = parent.datum;
                    $ctrl.zanrovi = parent.zanrovi;
                    $ctrl.filmovi = parent.filmovi;
                    $ctrl.imeFilma = movie.title;
                    $ctrl.novoImeFilma = movie.title;
                    $ctrl.noviZanrovi = [];
                    $ctrl.reditelj = "";
                    $ctrl.glumci = "";
                    $ctrl.rate = "";
                    console.log(movie);
                    console.log($ctrl.zanrovi);
                    
                    $ctrl.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    
                    $ctrl.save = function () {                        
                        for (var i in parent.filmovi) {
                            if ($ctrl.imeFilma == parent.filmovi[i].title) {
                                parent.filmovi[i].title = $ctrl.novoImeFilma;
                                if ($ctrl.reditelj != "") {
                                    parent.filmovi[i].director = $ctrl.reditelj;
                                }
                                if ($ctrl.glumci != "") {
                                    parent.filmovi[i].actors = $ctrl.glumci;
                                }
                                if ($ctrl.rate != "") {                                    
                                    parent.filmovi[i].rate = $ctrl.rate;
                                }
                                
                                
                                parent.filmovi[i].genres.splice(0, parent.filmovi[i].genres.length);
                                parent.filmovi[i].genres = $ctrl.noviZanrovi;
                                console.log("novi zanrovi", $ctrl.noviZanrovi);
                                console.log("posle pusha", parent.filmovi[i].genres);
                                console.log(parent.filmovi[i]);
                                $uibModalInstance.dismiss('cancel');                                
                            }
                        }                                                                       
                    };
                    
                    $ctrl.delete = function () {
                        $uibModalInstance.dismiss('cancel');
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'deleteModal.html',
                            controller: function ($uibModalInstance, parent1, parent2) {
                                var $ctrl2 = this;
                                $ctrl2.proveraFilma = "";                               
                                $ctrl2.disabled = true;
                                $ctrl2.cancel2 = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                                
                                $ctrl2.checkInput = function () {
                                    if (parent1.imeFilma == $ctrl2.proveraFilma) {
                                        $ctrl2.disabled = false;
                                    }
                                };
                                                              
                                $ctrl2.delete2 = function () {                                    
                                    for (var i in parent.filmovi) {
                                        if (parent1.imeFilma == parent2.filmovi[i].title) {
                                            console.log(parent2.filmovi.slice(i, 1));
                                            parent2.filmovi.splice(i, 1);
                                            parent2.svi_filmovi.splice(i, 1);
                                            $uibModalInstance.dismiss('cancel');
                                        }
                                    }                                    
                                };
                            },
                            controllerAs: '$ctrl2',
                            resolve: {
                                parent1: function () {
                                  return $ctrl;  
                                },
                                parent2: function () {
                                    return vm;
                                }
                            }
                        });
                    };
                },
                controllerAs: '$ctrl',
                resolve: {
                    movie: function () {
                        return el;
                    },
                    parent: function () {
                        return vm;
                    }
                }
            });            
        }
    };
});