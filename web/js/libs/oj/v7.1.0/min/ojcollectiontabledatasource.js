/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(["ojs/ojcore","jquery","ojs/ojmodel","ojs/ojdatasource-common"],function(e,t,a){"use strict";e.CollectionTableDataSource=function(t,n){if(this.data={},!(t instanceof a.Collection)){var l=e.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY,o=e.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;throw new Error(l+"\n"+o)}e.CollectionTableDataSource.superclass.constructor.call(this,t,n),this._collection=t,this._addCollectionEventListeners(),this.Init(),(null==n||"enabled"!==n.startFetch&&null!=n.startFetch)&&null!=n||(this._startFetchEnabled=!0)},e.Object.createSubclass(e.CollectionTableDataSource,e.TableDataSource,"oj.CollectionTableDataSource"),e.CollectionTableDataSource.prototype.comparator=null,e.CollectionTableDataSource.prototype.Init=function(){e.CollectionTableDataSource.superclass.Init.call(this)},e.CollectionTableDataSource.prototype.at=function(t,a){var n=a||{};n.deferred=!0;var l,o=this._collection.at(t,n),i=this;return i._isFetchingForAt=!0,new Promise(function(a,n){null!=o?o.then(function(e){i._isFetchingForAt=!1,l={data:e.attributes,index:t,key:e.id},a(l)},function(t){i._isFetchingForAt=!1,e.TableDataSource.superclass.handleEvent.call(i,e.TableDataSource.EventType.ERROR,t),n(t)}):a(null)})},e.CollectionTableDataSource.prototype.fetch=function(e){var t=e||{};return"init"!==t.fetchType||this._startFetchEnabled?this._fetchInternal(t):Promise.resolve()},e.CollectionTableDataSource.prototype.get=function(t,a){var n=a||{};n.deferred=!0;var l=this._collection.get(t,n),o=this;return new Promise(function(t,a){null!=l?l.then(function(e){if(e){var a={data:o._wrapWritableValue(e,e.attributes),index:e.index,key:e.id};t(a)}else t(null)},function(t){e.TableDataSource.superclass.handleEvent.call(o,e.TableDataSource.EventType.ERROR,t),a(t)}):t(null)})},e.CollectionTableDataSource.prototype.sort=function(e){null==e?e=this.sortCriteria:this.sortCriteria=e;var t=this.comparator,a=this;return new Promise(function(n){null==t?(a._collection.comparator=e.key,"ascending"===e.direction?a._collection.sortDirection=1:a._collection.sortDirection=-1):a._collection.comparator=t,a._collection.sort(null),n({header:e.key,direction:e.direction})})},e.CollectionTableDataSource.prototype.totalSize=function(){var e=this._collection.totalResults>=0?this._collection.totalResults:-1;if(e>-1){var t=this._collection.size();return t>e?t:e}if(this._fetchResultSize>0)e=this._fetchResultSize;else if("atLeast"===this.totalSizeConfidence())return this._collection.size();return e},e.CollectionTableDataSource.prototype.totalSizeConfidence=function(){return this._collection.totalResults>=0?"actual":this._collection.hasMore?"atLeast":"unknown"},e.CollectionTableDataSource.prototype._addCollectionEventListeners=function(){var n=this;this._collection.on(a.Events.EventType.SYNC,function(t){if(t instanceof a.Model)e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.CHANGE,{data:[t.attributes],keys:[t.id],indexes:[t.index]});else if(t instanceof a.Collection&&!n._isFetchingForAt&&!n._isFetching){var l=t.offset,o=t.lastFetchCount||t.lastFetchSize;if(o>0||n._collection.IsVirtual()){n._startIndex=l,n._pageSize=o;var i=0;(n._collection.totalResults>0||n._collection.hasMore)&&(i=l+o),n._isFetchingForAt=!0,t.IterativeAt(l,i).then(function(e){n._isFetchingForAt=!1;for(var t=[],a=[],o=0;o<e.length;o++)if(null!=e[o]){var i=e[o],c=n._wrapWritableValue(i,i.attributes);t.push(c),a.push(i.id)}var r={data:t,keys:a,startIndex:l};n._endFetch.call(n,{silent:!1},r)})}else{var c=n._getRowArray();n._endFetch.call(n,{silent:!1},c)}}}),this._collection.on(a.Events.EventType.ALLADDED,function(t,a){for(var l=[],o=[],i=[],c=0;c<a.length;c++){var r=a[c],s=n._wrapWritableValue(r,r.attributes);l.push(s),o.push(r.id),i.push(r.index)}e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.ADD,{data:l,keys:o,indexes:i})}),this._collection.on(a.Events.EventType.ALLREMOVED,function(t,a){for(var l=[],o=[],i=[],c=0;c<a.length;c++){var r=a[c];l.push(r.attributes),o.push(r.id),i.push(r.index)}e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.REMOVE,{data:l,keys:o,indexes:i})}),this._collection.on(a.Events.EventType.RESET,function(t){e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.RESET,t)}),this._collection.on(a.Events.EventType.SORT,function(a,l){if(null==l||!l.add){var o={};null==a||null==!a.comparator||t.isFunction(a.comparator)||(o.header=a.comparator,o.direction=1===a.sortDirection?"ascending":"descending"),e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.SORT,o)}}),this._collection.on(a.Events.EventType.CHANGE,function(t){e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.CHANGE,{data:[t.attributes],keys:[t.id],indexes:[t.index]})}),this._collection.on(a.Events.EventType.DESTROY,function(t){e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.DESTROY,t)}),this._collection.on(a.Events.EventType.REFRESH,function(t){e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.REFRESH,t)}),this._collection.on(a.Events.EventType.ERROR,function(t,a,l){e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.ERROR,t,a,l)}),this._collection.on(a.Events.EventType.REQUEST,function(t){n._isFetching||e.TableDataSource.superclass.handleEvent.call(n,e.TableDataSource.EventType.REQUEST,t)})},e.CollectionTableDataSource.prototype._fetchInternal=function(e){this._startFetch(e);var t=e||{},a=this;return this._isPaged=t.pageSize>0,this._startIndex=null==t.startIndex?this._startIndex:t.startIndex,this._pageSize=t.pageSize>0?t.pageSize:-1,t.pageSize=this._pageSize,t.startIndex=this._startIndex,t.refresh=!0,new Promise(function(e,n){var l=a._pageSize;a._isPaged||(l=25),a._collection.setRangeLocal(a._startIndex,l,{silent:!0}).then(function(n){var l;if(a._isPaged||a._collection.IsVirtual()){for(var o=[],i=[],c=0;c<n.models.length;c++){var r=n.models[c],s=a._wrapWritableValue(r,r.attributes);o[c]=s,i[c]=r.id}l={data:o,keys:i,startIndex:a._startIndex},n.models.length<a._pageSize?a.totalSize()<0&&(a._fetchResultSize=a._startIndex+n.models.length):a._fetchResultSize=null}else l=a._getRowArray();a._endFetch.call(a,t,l),e(l)},function(e){n(e)})})},e.CollectionTableDataSource.prototype._startFetch=function(t){this._isFetching=!0,t.silent||e.TableDataSource.superclass.handleEvent.call(this,e.TableDataSource.EventType.REQUEST,{startIndex:t.startIndex})},e.CollectionTableDataSource.prototype._endFetch=function(t,a){this._isFetching=!1,t.silent||e.TableDataSource.superclass.handleEvent.call(this,e.TableDataSource.EventType.SYNC,a)},e.CollectionTableDataSource.prototype._getRowArray=function(){for(var e=this._collection.size()-1,t=[],a=[],n=0;n<=e;n++){var l=this._collection.at(n),o=this._wrapWritableValue(l,l.attributes);t[n]=o,a[n]=l.id}return{data:t,keys:a,startIndex:this._startIndex}},e.CollectionTableDataSource.prototype.getCapability=function(e){return"sort"===e?"full":null},e.CollectionTableDataSource.prototype._wrapWritableValue=function(e,t){for(var a={},n=Object.keys(t),l=0;l<n.length;l++){!function(t){var n=e;Object.defineProperty(a,t,{get:function(){return n.get(t)},set:function(e){n.set(t,e,{silent:!0})},enumerable:!0})}(n[l])}return a}});