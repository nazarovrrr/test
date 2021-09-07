MSG_OBJ.paging_obj = (function () {
	var _this_obj,
		_els_obj,
		_els_labels,
		_checker_obj,
		_data_obj,
_msges_els,
		_msg_data,
		_defaults;

	/* var _bar_class = (function () {
			var _constr_func = function (mode_id, is_submsges, last_page_number, default_count,	current_page, pages_data) {
				this.bar_data = [
					mode_id,
					is_submsges,
					last_page_number,
					default_count,
					current_page,
					pages_data
				];
			};
			return _constr_func;
		}()), */
	var _page_class = (function () {
			var _constr_func = function (page_number, start_id, count, global_count, pages_data, is_last, start_count, subs_counter, stop_id) {
				this.page_data = [
					start_id || null_val,	// #00
					count || null_val,		// #01
					is_last || false,		// #02 NOT USED!!!!
					page_number || 1,		// #03
					global_count || count,	// #04
					pages_data,				// #05
					start_count || count,	// #06
					subs_counter || count,	// #07
					stop_id || null_val		// #08 stop_id
				];
			};

			_constr_func.prototype.subs_tree = function () {
				return this.page_data[5][0][7];
				// return this.page_data[5][0][5]["tree_obj"]
			};
			_constr_func.prototype.tree_obj = function () {
				return this.page_data[5][0][7];
				// return this.page_data[5][0][5]["tree_obj"]
			};
			_constr_func.prototype.start_id = function (param_val) {
				var is_first = this.page_data[3] === 1,
					is_submsges = this.page_data[5][0][1],
					start_id = is_first ? this.subs_tree().start_id(is_submsges) : this.page_data[0];

				if ((is_null(param_val)) || start_id === param_val) {
					if (is_first) this.page_data[0] = start_id;
					return start_id;
				}

				start_id = !(param_val > 0) ? -1 : param_val;

				this.page_data[0] = start_id;

				if (is_first) this.subs_tree().start_id(is_submsges, start_id, true);

				return start_id;

	/*			if (param_val === true) {
					var subs_tree = this.subs_tree().subs(is_submsges);

					while (subs_tree[start_id] && subs_tree[start_id].is_removed()) start_id = start_id + 1;

					this.page_data[0] = start_id;

					if (is_first) this.subs_tree().start_id(is_submsges, start_id, true);
				} else if (Math.abs(param_val) > 0) {
					start_id = param_val;

					if (is_first) this.subs_tree().start_id(is_submsges, start_id, true);
					else this.page_data[0] = start_id;
				}

				return start_id;			 */
			};
			_constr_func.prototype.stop_id = function (param_val, shift_count) {
				var is_last = this.page_data[5][0][2] === this.page_data[3],
					is_submsges = this.page_data[5][0][1],
					stop_id = is_last ? this.subs_tree().stop_id(is_submsges) : this.page_data[8];

				if ((is_null(param_val)) || stop_id === param_val) {
					if (is_last) this.page_data[8] = stop_id;
					return stop_id;
				}

				stop_id = !(param_val > 0) ? -1 : param_val;

				if (shift_count > 0 && stop_id > 0) {
					var subs_tree = this.subs_tree().subs(is_submsges),
						i_stop_id = stop_id,
						i_tree_obj;

					while (shift_count > 0) {
						i_tree_obj = subs_tree[i_stop_id];

						if (!i_tree_obj) break;

						stop_id = i_stop_id;
						shift_count = shift_count - 1;

						i_stop_id = i_tree_obj.next_id();
					}
				}

				this.page_data[8] = stop_id;

				if (is_last) this.subs_tree().stop_id(is_submsges, stop_id, true);

				return stop_id;
			};
			_constr_func.prototype.paging_els = function (el_name, el_arr_id) {
				if (!el_name) return this.page_data[5][0][5]["paging_els"];
				//if (this.page_data[5][0][5]["paging_els"][el_name])
				// return this.page_data[5][0][5]["paging_els"][el_name][el_arr_id ? 1 : 0];
				return this.page_data[5][0][5]["paging_els"][el_name][1];
			};
			_constr_func.prototype.subs_to_load = function (el_id, arr_data) {
				var is_submsges_id = this.page_data[5][0][1] ? 1 : 0,
					subs_arr = this.page_data[5][0][5]["subs_to_load"][is_submsges_id];

				return subs_arr.push_id(el_id, arr_data);
			};
			_constr_func.prototype.inter_data = function (is_inter_modes_data) {
				return is_inter_modes_data ? this.page_data[5][0][5] : this.page_data[5][0][8];
			};
			_constr_func.prototype.mode_data = function (param_name) {
				return param_name ? this.page_data[5][0][8][param_name] : this.page_data[5][0][8];
			};
			_constr_func.prototype.inter_modes_data = function (param_name, param_name_2) {
				var inter_modes_data = this.page_data[5][0][8]["inter_modes_data"],
					is_submsges_id = param_name === true ? 1 : (param_name === false ? 0 : -1);

				inter_modes_data = inter_modes_data[is_submsges_id > -1 ? is_submsges_id : this.is_submsges(true)];

				if (is_submsges_id > -1) param_name = param_name_2 || false;

				return inter_modes_data && param_name ? inter_modes_data[param_name] : inter_modes_data;
			};
			_constr_func.prototype.is_changed = function (is_changed, another_is_changed) {
				if (is_null(is_changed)) return this.page_data[5][0][9];

				var current_mode = _paging_mode(is_changed === true || is_changed === false ? false : is_changed),
					this_data = this.page_data[5][0],
					another_page_obj = another_is_changed || another_is_changed === false ? this.another_page_obj() : false;
					// this_mode = this_data[0],
					// another_data = this_mode !== current_mode && current_mode !== "msg" && current_mode !== "subs" ? this.another_pages_data() : false;

				this_data[9] = is_changed ? current_mode : false;

				if (another_page_obj) another_page_obj.is_changed(another_is_changed);

				// if (another_data) another_data[9] = this_data[9];

				// alert_if(another_data, "_constr_func.prototype.is_changed: " + current_mode + "->" + this_mode);

				return this_data[9];

				/*	if (is_changed) is_changed = _paging_mode();

				if (is_and_another_mode) {
					var another_data = this.another_pages_data();

					if (another_data) another_data[9] = is_changed;
				}


				return this.page_data[5][0][9];			 */
			};
			_constr_func.prototype.another_mode = function (this_mode) {
				this_mode = this_mode || this.page_data[5][0][0];

				if (this_mode === "msg" || this_mode === "subs") return this_mode === "msg" ? "subs" : "msg";

				return this.page_data[5][0][11] || this.page_data[5][0][0];

				// return this_mode;
			};
			_constr_func.prototype.another_pages_data = function (this_mode, is_full) {
				this_mode = this_mode || this.page_data[5][0][0];

				var is_submsges = this.page_data[5][0][1],
					another_mode = this.another_mode(this_mode),
					another_data = _paging_data(another_mode)[is_submsges ? 1 : 0];

				return is_full ? another_data : another_data[0];
			};
			_constr_func.prototype.another_page_obj = function (another_mode, page_number) {
				var is_submsges = this.page_data[5][0][1];
					// this_mode = this.page_data[5][0][0];

				another_mode = another_mode || this.page_data[5][0][11];

				return another_mode ? _get_page(is_submsges, 1, another_mode) : false;
			};
			_constr_func.prototype.middle_id = function (is_right, param_val) {
				var middle_id = this.page_data[5][0][5]["middle_ids"][is_right ? 1 : 0];

				if ((is_null(param_val)) || param_val === middle_id) return middle_id;

				var middle_ids = this.page_data[5][0][5]["middle_ids"],
					is_submsges = this.page_data[5][0][1],
					is_full = this.subs_tree().counters(is_submsges)[2] < 1;

				if (param_val > 0) middle_ids[is_right ? 1 : 0] = param_val;
				else delete middle_ids[is_right ? 1 : 0];

				if (!is_full) return param_val;

				my_alert("? _constr_func.prototype.middle_id CLEAR middle_id!");

				var that_id = middle_ids[is_right ? 0 : 1],
					// subs_tree = this.subs_tree().subs(is_submsges),
					offset_count;

				alert_if(is_right, "only if del prelast and last is undef!!! _constr_func.prototype.middle_id", is_right, param_val, that_id);
				alert_if(param_val === that_id, "not to be!!! _constr_func.prototype.middle_id", is_right, param_val, that_id);

				// my_alert([param_val, that_id]);

				if (!is_right && that_id > 0) {
					offset_count = is_right ? (that_id - param_val) : (param_val - that_id);
					my_alert("? _constr_func.prototype.middle_id");

					// alert_if(offset_count !== this.subs_tree().tie(is_submsges, param_val, that_id), "err! _constr_func.prototype.middle_id");
					alert_if(offset_count !== _data_obj.tie_subs(this.subs_tree(), is_submsges, param_val, that_id), "err! _constr_func.prototype.middle_id");



					// subs_tree[is_right ? that_id : param_val].next_id(offset_count);
					// subs_tree[is_right ? param_val : that_id].prev_id(offset_count);
				}

				this.page_data[5][0][5]["middle_ids"] = [];
				this.page_data[5][0][6] = [];
			};
			_constr_func.prototype.is_middle = function (is_right, is_set) {
				var middle_pages = this.page_data[5][0][6],
					page_number = this.page_data[3];

				if (is_set) middle_pages[is_right ? 1 : 0] = page_number;

				return middle_pages[is_right ? 1 : 0] === page_number;
			};
			_constr_func.prototype.middle_page = function (is_right) {
				return this.page_data[5][0][6][is_right ? 1 : 0];
			};
			/* _constr_func.prototype.start_id1 = function (param_val) {
				if (param_val === true) {
					var start_id = this.page_data[0],
						is_submsges = this.page_data[5][0][1],
						subs_tree = _msg_data["subs_tree"].subs(is_submsges);

					while (subs_tree[start_id] && subs_tree[start_id].is_removed()) start_id = start_id + 1;
					this.page_data[0] = start_id;
				} else if (Math.abs(param_val) > 0) this.page_data[0] = param_val;

				return this.page_data[0];
			}; */
			_constr_func.prototype.is_first = function () {
				// alert("_constr_func.prototype.is_first");
				return this.page_data[3] === 1;
			};
			_constr_func.prototype.start_count = function (param_val) {
				var current_val = this.page_data[6] > 0 ? this.page_data[6] : 0;

				if (!param_val) return current_val;

				current_val = current_val + param_val;

				this.page_data[6] = current_val > 0 ? current_val : 0;

				return current_val;
			};
			_constr_func.prototype.last_count = function () {
				return this.page_data[6] > 0 ? this.page_data[6] : 0;
			};
			_constr_func.prototype.loaded = function (param_val, is_reset) {
				var current_val = this.page_data[1] > 0 ? this.page_data[1] : 0;

				if (!param_val) return current_val;

				current_val = (is_reset ? 0 : current_val) + param_val;

				this.page_data[1] = current_val > 0 ? current_val : 0;

				if (current_val > 0 && !this.page_data[5][this.page_data[3]]) this.page_data[5][this.page_data[3]] = this;

				return current_val;
			};
			_constr_func.prototype.counter = function (param_val, is_reset) {
				if (param_val > 0) {
					if (is_reset) _set_global_counter(this, param_val);
					else this.page_data[4] = param_val;
				}
				return this.page_data[4];
			};
			_constr_func.prototype.subs_count = function (param_val, is_reset) {
				var current_val = this.page_data[7] > 0 ? this.page_data[7] : 0;

				if (!param_val) return current_val;

				current_val = (is_reset ? 0 : current_val) + param_val;

				this.page_data[7] = current_val > 0 ? current_val : 0;

				return current_val;
			};
			_constr_func.prototype.next = function (is_force) {
				return _get_page(this.page_data[5][0][1], this.page_data[3] + 1);
			};
			/* _constr_func.prototype.bind_with_neighbourggggggggggg = function (is_with_next) {
				var that_page = this.neighbour(is_with_next),
					that_id = is_with_next ? that_page.start_id() : that_page.stop_id();

				if (!that_id || that_id < 1) return;

				// var this_id = is_with_next ? that_page.stop_id() : that_page.start_id(),
					// that_page = this.neighbour(is_with_next),
					// that_id = is_with_next ? that_page.start_id() : that_page.stop_id(),
					// is_submsges = this.page_data[5][0][1],
					// subs_tree = this.subs_tree().subs(is_submsges),
					// that_tree_obj = subs_tree[that_id];


				return _get_page(this.page_data[5][0][1], this.page_data[3] + 1);
			}; */
			_constr_func.prototype.neighbour = function (is_next, is_force) {
				var neighbour_page_number = this.page_data[3] + (is_next ? 1 : -1),
					result_page = this.page_data[5][neighbour_page_number] || false;

				if (!result_page && is_force) result_page = _get_page(this.page_data[5][0][1], neighbour_page_number);

				return result_page;
			};
			_constr_func.prototype.is_full = function () {
				return this.page_data[1] === this.page_data[7];
			};
			_constr_func.prototype.pages_data = function (is_full) {
				return is_full ? this.page_data[5] : this.page_data[5][0];
			};
			/* _constr_func.prototype.find_page_numbehhhhr = function () {
				return is_full ? this.page_data[5] : this.page_data[5][0];
			}; */
			_constr_func.prototype.last_sub_id = function (last_sub_id) {
				my_alert("is used? _constr_func.prototype.last_sub_id");
				if (last_sub_id > 0) this.page_data[5][0][5]["last_sub_id"] = last_sub_id;
				return this.page_data[5][0][5]["last_sub_id"];
			};
			_constr_func.prototype.is_last = function (is_last) {
				var this_val = this.page_data[5][0][2],
					page_number = this.page_data[3];

				if (is_null(is_last)) return this_val === page_number;

				this.page_data[5][0][2] = is_last ? page_number : null_val;

				return is_last;
			};
			_constr_func.prototype.append_count = function () {
				var append_count = this.page_data[5][0][2] === this.page_data[3] ? 0 : this.page_data[5][0][3] - this.page_data[7];
				return append_count > 0 ? append_count : 0;
			};
			_constr_func.prototype.shift = function (shift_count, subs_count1, is_check) {
				var shift_direction = shift_count > 0 ? -1 : 1,
					start_id = this.start_id(),
					old_start_id = start_id,
					start_count = 0,
					last_count = 0,
					stop_id = this.stop_id(),
					tree_stop_id = this.subs_tree().stop_id(),
					is_submsges = this.page_data[5][0][1],
					subs_tree = this.subs_tree().subs(is_submsges),
					subs_count = this.subs_count(),
					to_load_count = subs_count - this.loaded(),
					i_sub_id, i_shift_count, before_id, last_id; //i_tree_obj,shift_counter ,

				shift_count = Math.abs(shift_count);

				if (shift_count > subs_count) shift_count = subs_count;

				i_shift_count = shift_count;

				subs_count = this.subs_count(i_shift_count * shift_direction);

				if (start_id > 0) {
					i_sub_id = start_id;

					while (i_shift_count > 0 && i_sub_id > 0) {
						i_shift_count = i_shift_count - 1;
						start_count = start_count + 1;

						before_id = i_sub_id;
						i_sub_id = subs_tree[i_sub_id].next_id();
					}

					start_id = i_sub_id;
				}

				if (i_shift_count > 0) {
					start_id = i_shift_count === to_load_count && stop_id > 0 ? this.middle_id(true) : null_val;

					i_shift_count = i_shift_count > to_load_count ? i_shift_count - to_load_count : 0;

					last_id = before_id;
					before_id = null_val;
				}

				if (i_shift_count > 0 && stop_id > 0) {
					i_sub_id = this.middle_id(true);

					while (i_shift_count > 0 && i_sub_id > 0) {
						i_shift_count = i_shift_count - 1;
						last_count = last_count + 1;

						before_id = i_sub_id;
						i_sub_id = subs_tree[i_sub_id].next_id();
					}

					alert_if(!(i_sub_id > 0) && tree_stop_id !== before_id, "err! _constr_func.prototype.shift_1", i_sub_id);

					start_id = i_sub_id;
				}

				alert_if(i_shift_count > 0, "err! _constr_func.prototype.shift_2", i_shift_count);

				this.page_data[0] = start_id;

				this.page_data[1] = this.page_data[1] - (start_count + last_count);

				if (subs_count < 1) {
					this.page_data[4] = null_val;
					this.page_data[8] = null_val;
				} else if (subs_count === 1) this.page_data[8] = start_id;

				if (last_count > 0) this.start_count(this.page_data[1], true);
				else if (start_count > 0) this.start_count(-1 * start_count);
				else if (start_id > 0) this.start_count(this.page_data[1], true);

				return [
					before_id,
					start_count,
					last_count,
					old_start_id,
					"not used",
					shift_count,
					before_id > 0 ? before_id : last_id
				];
			};
			/* _constr_func.prototype.shift0 = function (shift_count, subs_count1, is_check) {
				var shift_direction = shift_count > 0 ? -1 : 1,
					start_id = this.start_id(),
					old_start_id = start_id,
					start_count = 0,
					last_count = 0,
					stop_id = this.stop_id(),
					subs_tree = this.subs_tree().subs(this.page_data[5][0][1]),
					subs_count = this.subs_count(),
					to_load_count = subs_count - this.loaded(), //from_id,
					i_sub_id, i_tree_obj, pre_stop_id, shift_counter;

				shift_count = Math.abs(shift_count);

				if (shift_count > subs_count) shift_count = subs_count;

				shift_counter = shift_count;

				subs_count = this.subs_count(shift_counter * shift_direction);

				if (start_id > 0) {
					i_sub_id = start_id;

					while (shift_counter > 0) {
						i_tree_obj = subs_tree[i_sub_id] || false;

						if (!i_tree_obj) break;

						i_sub_id = i_tree_obj.next_id();

						shift_counter = shift_counter - 1;

						start_count = start_count + 1;

						pre_stop_id = start_id;

						start_id = i_sub_id;
					}
				}

				if (shift_counter > 0) {
					shift_counter = shift_counter > to_load_count ? shift_counter - to_load_count : 0;

					pre_stop_id = start_id;

					start_id = null_val;
				}

				if (shift_counter > 0 && this.stop_id() > 0) {
					i_sub_id = this.stop_id();

					while (i_sub_id > 0) {
						start_id = i_sub_id;

						i_sub_id = subs_tree[i_sub_id].prev_id();
					}

					alert_if(start_id !== this.middle_id(true), "!!!shift " + start_id + "-" + this.middle_id(true));

					i_sub_id = start_id;

					while (shift_counter > 0) {
						i_tree_obj = subs_tree[i_sub_id] || false;

						if (!i_tree_obj) break;

						i_sub_id = i_tree_obj.next_id();

						shift_counter = shift_counter - 1;

						last_count = last_count + 1;

						pre_stop_id = start_id;

						start_id = i_sub_id || null_val;
					}
				}

				this.page_data[0] = start_id;

				if (subs_count < 1) {
					this.page_data[4] = null_val;
				}

				if (subs_count < 2) {
					this.page_data[8] = subs_count < 1 ? null_val : start_id; // null_val;
				}

				if (start_count > 0 || last_count > 0) {
					if (start_count > 0) this.start_count(-1 * start_count);

					this.page_data[1] = this.page_data[1] - (start_count + last_count);
				}

				return [
					pre_stop_id,
					start_count,
					last_count,
					old_start_id,
					stop_id,
					shift_count
				];
			};
			_constr_func.prototype.shift1 = function (shift_count, subs_count, is_check) {
				var shift_direction = shift_count > 0 ? 1 : -1,
					start_id = this.page_data[0],
					subs_tree = this.subs_tree().subs(this.page_data[5][0][1]),
					i_sub_id = start_id,
					i_tree_obj;

				shift_count = Math.abs(shift_count);

				while (shift_count > 0) {
					i_tree_obj = subs_tree[i_sub_id] || false;

					if (!i_tree_obj) break;

					i_sub_id = i_tree_obj.next_id();

					shift_count = shift_count - 1;

					start_id = i_sub_id;
				}

				this.page_data[0] = start_id;

				if (Math.abs(subs_count) > 0) this.subs_count(subs_count, is_check);

				return shift_count;
			};
			_constr_func.prototype.shift4 = function (shift_count, subs_count, is_check) {
				var shift_direction = shift_count > 0 ? 1 : -1,
					start_id = this.page_data[0],
					subs_tree = this.subs_tree().subs(this.page_data[5][0][1]),
					i_sub_id = start_id,
					i_tree_obj;

				shift_count = Math.abs(shift_count);

				while (shift_count > 0) {
					i_sub_id = i_sub_id + shift_direction;

					i_tree_obj = subs_tree[i_sub_id] || false;

					if (i_tree_obj && i_tree_obj.is_removed()) continue;

					start_id = i_sub_id;

					shift_count = shift_count - 1;
				}

				this.page_data[0] = start_id;

				if (Math.abs(subs_count) > 0) this.subs_count(subs_count, is_check);

				return start_id;
			}; */
			_constr_func.prototype.is_loaded = function (is_loaded) {
				return this.page_data[1] > 0;
			};
			_constr_func.prototype.page_number = function (page_number) {
				if (page_number > 0) {
					this.page_data[3] = page_number;
					if (page_number === 1) this.start_id(this.page_data[0]);
				}
				return this.page_data[3] || 1;
			};
			_constr_func.prototype.is_new_page = function () {
				return this.page_data[1] < 1;
			};
			_constr_func.prototype.is_current = function (is_set) {
				if (is_set) this.page_data[5][0][4] = this.page_data[3];
				return is_set || this.page_data[5][0][4] === this.page_data[3];
			};
			/* _constr_func.prototype.reset = function (start_counter, stop_counter, default_count) {
				while (start_counter < stop_counter) {
					i_tree_obj = subs_tree[i_msg] || false;

					if (i_tree_obj && i_tree_obj.is_removed()) {
						i_msg = i_msg + 1;
						continue;
					}

					if (i_start_i_msg === false) i_start_i_msg = i_msg;

					i_subs_counter = i_subs_counter + 1;
					i_msg_counter_max = i_msg_counter_max + 1;
					i_msg = i_msg + 1;

					if (!i_tree_obj) continue;

					i_msg_counter = i_msg_counter + 1;
				}

			}; */
			_constr_func.prototype.is_submsges = function (is_id) {
				return is_id ? (this.page_data[5][0][1] ? 1 : 0) : this.page_data[5][0][1];
			};
			_constr_func.prototype.is_fold = function (is_toggle, is_fold) {
				if (is_toggle) this.page_data[5][0][10] = !this.page_data[5][0][10];
				else if (is_fold || is_fold === false) this.page_data[5][0][10] = is_fold === true;
				return this.page_data[5][0][10];
			};
			/* _constr_func.prototype.is_last_showed2 = function (is_set) {
				var this_mode = this.this_mode(),
					is_main_mode = _is_main_mode(this_mode),
					last_showed_arr = is_main_mode ? this.page_data[5][0][5]["last_showed"] : false,
					inter_data = this.inter_data(true);

				if (is_set) this.page_data[5][0][5]["last_showed"] = [this.page_data[5][0][0], this.page_data[5][0][1]];
				else if (is_set === false) this.page_data[5][0][5]["last_showed"] = [];

				return last_showed_arr[0] === this.page_data[5][0][0] && last_showed_arr[1] === this.page_data[5][0][1];
			}; */
			_constr_func.prototype.is_last_showed = function (is_set) {
				var this_mode = this.this_mode(),
					is_main_mode = _is_main_mode(this_mode),
					is_submsges = this.is_submsges(),
					is_submsges_id = this.is_submsges(true),
					data_arr = this.page_data[5][0][is_main_mode ? 5 : 8],
					last_showed = is_main_mode ? "last_showed" : "is_submsges",
					last_data = data_arr[last_showed];

				if (is_set) {
					data_arr[last_showed] = is_main_mode ? [this_mode, is_submsges] : is_submsges_id;
					// alert_if(!is_main_mode, "_constr_func.prototype.is_last_showed", last_data === is_submsges_id);
				} else if (is_set === false) data_arr[last_showed] = is_main_mode ? [] : -1;

				return is_main_mode ? (last_data[0] === this_mode && last_data[1] === is_submsges) : last_data === is_submsges_id;
			};
			_constr_func.prototype.is_in_show_range = function (sub_number) {
				return sub_number < this.page_data[0] && sub_number > this.page_data[8];
			};
			_constr_func.prototype.show_range = function (is_save) {
				if (is_save === false) {
					this.page_data[5][0][5]["showed_range"] = [];
					return;
				}

				var showed_arr = this.page_data[5][0][5]["showed_range"],
					result_arr = [
						[this.page_data[0], this.page_data[7], this.stop_id(), this],
						[showed_arr[0], showed_arr[1], showed_arr[2], showed_arr[3]]
					]; //tree_obj, is_submsges;

				if (!is_save) return result_arr;

				if (result_arr[0][0] === showed_arr[0] && result_arr[0][1] === showed_arr[1] && result_arr[0][2] === showed_arr[2]) delete result_arr[1];
				else {
					// if (result_arr[0][2] > showed_arr[2] && showed_arr[2] > 0) {
						// is_submsges = this.page_data[5][0][1];
						// tree_obj = this.subs_tree();

						// result_arr[1][1] = tree_obj.subs_distance(is_submsges, showed_arr[0], showed_arr[2]) + 1;
					// }

					this.page_data[5][0][5]["showed_range"] = result_arr[0];
				}


				return result_arr;
			};
			_constr_func.prototype.last_showed = function (is_set_this) {
				if (is_set_this) this.page_data[5][0][5]["last_showed_page_obj"] = this;

				return this.page_data[5][0][5]["last_showed_page_obj"];
			};
			_constr_func.prototype.compare_ranges = function (another_page_obj) {
				if (!another_page_obj) another_page_obj = this.last_showed();
				if (this.page_data[5][0][1] !== another_page_obj.is_submsges()) return;

				// i_new_stop_id = i_page_obj.stop_id();
				// i_stop_id = last_showed_page_obj.stop_id();

				// if (current_page_number === page_number && i_new_stop_id > i_stop_id && i_stop_id > 0) {
					//&& i_page_obj.is_last_showed()

					// showed_range_arr[0] = subs_tree[i_new_stop_id].next_id();
					// showed_range_arr[1] = tree_obj.subs_distance(is_submsges, i_new_stop_id, i_stop_id);

					// my_alert(["_recalc_pages i_new_stop_id > i_stop_id ", page_number, i_new_stop_id, i_stop_id, showed_range_arr[0], showed_range_arr[1]]);
				// }

				return this.page_data[5][0][5]["last_showed_page_obj"];
			};
			_constr_func.prototype.mode_type = function () {
				return this.this_mode();
			};
			_constr_func.prototype.this_mode = function () {
				return this.page_data[5][0][0];
			};
			_constr_func.prototype.mode_name = function () {
				return this.this_mode();
			};
			_constr_func.prototype.last_page_number = function (param_val) {
				my_alert("_constr_func.prototype.last_page_number");

				if (param_val > 0) this.page_data[5][0][2] = param_val;
				return this.page_data[5][0][2];
			};
			_constr_func.prototype.check = function (is_correct) {
				var page_number = this.page_data[3],
					pages_data = this.page_data[5],
					is_submsges = pages_data[0][1],
					is_last = this.is_last(),
					is_first = this.is_first(),
					subs_tree_obj = this.subs_tree(),
					start_id = is_first ? subs_tree_obj.start_id(is_submsges) : this.page_data[0],
					stop_id = is_last ? subs_tree_obj.stop_id(is_submsges) : this.page_data[8],
					start_count = 0,
					last_count = 0,
					loaded_count = 0, // temp_val,
					subs_count = this.page_data[7],
					subs_tree = subs_tree_obj.subs(is_submsges),
					next_sub_id,
					from_start_id = start_id,
					from_stop_id = stop_id,
					from_el_id = 0,
					i_subs_count = subs_count,
					i_tree_obj, i_sub_id;

				err_if(subs_count < 1, "_constr_func.prototype.check subs_count < 1");

				if (subs_count === 1 && start_id < 1 && stop_id > 0) start_id = from_start_id = stop_id;

				if (start_id < 1) { // if empty top
					var neighbour_page_obj = !is_first ? pages_data[page_number - 1] : false,
						is_next = stop_id < 1 && (!neighbour_page_obj || is_first);

					if (is_next && (is_first || is_last)) {
						my_alert("_constr_func.prototype.check is_next && (is_first || is_last) " + subs_count);
						// ??? !!! 18/06/2014
						if (is_last && is_correct && !this.page_data[5][page_number]) {
							this.page_data[5][page_number] = this;
						}
						// ??? !!! 18/06/2014

						return {
							is_prev: is_last,
							to_load_count: subs_count
						};
					}

					if (is_next) neighbour_page_obj = pages_data[page_number + 1];

					if (neighbour_page_obj) {
						if (is_next) {
							from_stop_id = neighbour_page_obj.start_id();
							last_count = last_count - (from_stop_id > 0 ? 1 : 0);
						} else {
							from_start_id =  neighbour_page_obj.stop_id();
							start_count = start_count - (from_start_id > 0 ? 1 : 0);
						}

						i_subs_count = i_subs_count + 1;
					}
				}

				if (from_start_id > 0) { // if loaded top
					i_sub_id = from_start_id;
					i_tree_obj = subs_tree[i_sub_id];

					while (i_tree_obj) {
						start_count = start_count + 1;
						from_start_id = i_sub_id;

						if (start_count === 1) start_id = from_start_id;

						i_subs_count = i_subs_count - 1;

						if (i_subs_count < 1) break;

						i_sub_id = i_tree_obj.next_id();
						i_tree_obj = subs_tree[i_sub_id];
					}

					if (i_subs_count < 1) stop_id = from_start_id;

					if (is_correct) {
						this.start_id(start_id);

						if (start_count > 0) this.page_data[6] = start_count;
						if (i_subs_count < 1) this.stop_id(stop_id);
					}
				}

				if (i_subs_count > 0) {
					var unloaded_count = subs_tree_obj.counters(is_submsges)[2],
						middle_count = start_id > 0 && i_subs_count > unloaded_count ? unloaded_count : 0;
						// middle_count = i_subs_count > unloaded_count ? unloaded_count : 0; 16.02.2015

					if (middle_count > 0) { // if loaded top and bottom && empty middle
						from_stop_id = this.middle_id(true);
						i_sub_id = from_stop_id;

						my_alert("info! _constr_func.prototype.check: middle empty" + [unloaded_count, i_subs_count, i_sub_id,  page_number]);

						while (i_subs_count > middle_count) {
							i_tree_obj = subs_tree[i_sub_id];

							err_if(!i_tree_obj, "_constr_func.prototype.check: ", i_sub_id, i_subs_count);

							i_subs_count = i_subs_count - 1;
							last_count = last_count + 1;
							stop_id = i_sub_id;

							i_sub_id = i_tree_obj.next_id();
						}

						my_alert(["info! _constr_func.prototype.check: if_A ", subs_count, start_count, last_count]);
					} else if (from_stop_id > 0) { // if empty top && loaded bottom
						i_sub_id = from_stop_id;

						while (i_subs_count > 0) {
							i_tree_obj = subs_tree[i_sub_id];

							if (!i_tree_obj) break;

							i_subs_count = i_subs_count - 1;
							last_count = last_count + 1;
							from_stop_id = i_sub_id;

							if (last_count === 1) stop_id = from_stop_id;

							i_sub_id = i_tree_obj.prev_id();
						}

						alert_if(i_subs_count < 1, "info! _constr_func.prototype.check: if_B ", subs_count, start_count, last_count);
					}

					if (i_subs_count < 1) {
						my_alert("info! _constr_func.prototype.check: ???" + [unloaded_count, i_subs_count, i_sub_id,  page_number]);

						start_id = from_stop_id;
						start_count = last_count;
						last_count = 0;
					}

					if (is_correct) {
						if (i_subs_count < 1) {
							this.start_id(start_id);
							this.page_data[6] = start_count;
						}

						this.stop_id(stop_id);
					}
				}

				loaded_count = start_count + last_count;

				if (is_correct) {
					this.page_data[1] = loaded_count > 0 ? loaded_count : subs_count * -1;

					if ((is_last || loaded_count > 0) && !this.page_data[5][page_number]) this.page_data[5][page_number] = this;
				}

				if (from_start_id > 0 || from_stop_id > 0) {
					from_el_id = from_start_id > 0 ? from_start_id : from_stop_id;

					err_if(!subs_tree[from_el_id], "_page_class.check 1:", from_el_id, from_start_id, from_stop_id, page_number);

					if (from_stop_id > 0) next_sub_id = subs_tree[from_el_id].next_id();

					from_el_id = subs_tree[from_el_id].el_id();
				}

				return {
					start_id: from_start_id,
					stop_id: from_stop_id,
					from_el_id: from_el_id,
					is_prev: from_start_id < 1,
					subs_count: subs_count,
					start_count: start_count,
					loaded_count: loaded_count,
					last_count: last_count,
					to_load_count: subs_count - loaded_count,
					page_number: page_number,
					next_sub_id: next_sub_id
				};
			};
			/* _constr_func.prototype.check1 = function (is_correct) {
				var page_number = this.page_data[3],
					pages_data = this.page_data[5],
					is_submsges = pages_data[0][1],
					is_last = this.is_last(),
					is_first = page_number === 1,
					subs_tree_obj = this.subs_tree(),
					start_id = is_first ? subs_tree_obj.start_id(is_submsges) : this.page_data[0],
					stop_id = is_last ? subs_tree_obj.stop_id(is_submsges) : this.page_data[8],
					start_count = 0,
					last_count = 0,
					loaded_count = 0, temp_val,
					subs_count = this.page_data[7],
					subs_tree = subs_tree_obj.subs(is_submsges),
					is_next = start_id < 1 && stop_id > 0,
					neighbour_page_obj, i_tree_obj, i_sub_id,
					middle_count = 0,
					unloaded_count = 0,
					next_sub_id,
					from_start_id = start_id,
					from_stop_id = stop_id,
					from_el_id = 0,
					i_subs_count = subs_count;

				// break_test(pages_data, "_constr_func.prototype.check pages_data");

				if (i_subs_count === 1 && is_next) start_id = from_start_id = stop_id;

				if (start_id < 1) {
					neighbour_page_obj = pages_data[page_number - 1];

					is_next = stop_id < 1 && (!neighbour_page_obj || page_number === 1);

					if (is_next) {
						if (page_number === 1 || is_last) return {
							is_prev: is_last,
							to_load_count: i_subs_count
						};

						neighbour_page_obj = pages_data[page_number + 1];
					}
				}

				if (neighbour_page_obj) {
					i_subs_count = i_subs_count + 1;

					if (is_next) {
						from_stop_id = neighbour_page_obj.start_id();
						last_count = last_count - (from_stop_id > 0 ? 1 : 0);
					} else {
						from_start_id =  neighbour_page_obj.stop_id();
						start_count = start_count - (from_start_id > 0 ? 1 : 0);
					}
				}

				if (from_start_id > 0) {
					i_sub_id = from_start_id;

					while (i_subs_count > 0) {
						i_tree_obj = subs_tree[i_sub_id];

						if (!i_tree_obj) break;

						i_subs_count = i_subs_count - 1;
						start_count = start_count + 1;
						from_start_id = i_sub_id;

						if (start_count === 1) start_id = from_start_id;

						i_sub_id = i_tree_obj.next_id();
					}

					if (i_subs_count < 1) stop_id = from_start_id;

					if (is_correct) {
						this.start_id(start_id);

						if (start_count > 0) this.page_data[6] = start_count;
						if (i_subs_count < 1) this.stop_id(stop_id);
					}
				}

				if (i_subs_count > 0) {
					unloaded_count = subs_tree_obj.counters(is_submsges)[2];
					middle_count = i_subs_count - unloaded_count; // unloaded_count < i_subs_count;

					if (middle_count > 0) {	// if loaded top and bottom. middle empty

						from_stop_id = this.middle_id(true);
						i_sub_id = from_stop_id;

						my_alert("!!!_constr_func.prototype.check PAGE MIDDLE EMPTY" + [unloaded_count, i_subs_count, i_sub_id,  page_number]);

						i_subs_count = i_subs_count - unloaded_count;
						// i_subs_count = subs_tree_obj.counters()[2];

						while (i_subs_count > 0) {
							i_tree_obj = subs_tree[i_sub_id];

							alert_if(!i_tree_obj, "_constr_func.prototype.check", i_sub_id, i_subs_count);

							i_subs_count = i_subs_count - 1;
							last_count = last_count + 1;
							stop_id = i_sub_id;

							i_sub_id = i_tree_obj.next_id();
						}
					} else if (from_stop_id > 0) { // if loaded bottom. top empty
						i_sub_id = from_stop_id;

						while (i_subs_count > 0) {
							i_tree_obj = subs_tree[i_sub_id];

							if (!i_tree_obj) break;

							i_subs_count = i_subs_count - 1;
							last_count = last_count + 1;
							from_stop_id = i_sub_id;

							if (last_count === 1) stop_id = from_stop_id;

							i_sub_id = i_tree_obj.prev_id();
						}
					}

					if (i_subs_count < 1) {
						start_id = from_stop_id;
						start_count = last_count;
						last_count = 0;
					}

					if (is_correct) {
						if (i_subs_count < 1) {
							this.start_id(start_id);
							this.page_data[6] = start_count;
						}

						this.stop_id(stop_id);
					}
				}

				// my_alert("+" + [start_count, last_count]);

				loaded_count = start_count + last_count;

				// alert_if(loaded_count === 6, start_count, last_count, is_next)

				if (is_correct) {
					this.page_data[1] = loaded_count > 0 ? loaded_count : subs_count * -1;

					if (loaded_count > 0 && !this.page_data[5][page_number]) this.page_data[5][page_number] = this;
				}

				if (from_start_id > 0 || from_stop_id > 0) {
					from_el_id = from_start_id > 0 ? from_start_id : from_stop_id;

					alert_if(!subs_tree[from_el_id], "err! _page_class.check 1:", from_el_id, from_start_id, from_stop_id, page_number);

					if (from_stop_id > 0) next_sub_id = subs_tree[from_el_id].next_id();

					from_el_id = subs_tree[from_el_id].el_id();
				}

				return {
					start_id: from_start_id,
					stop_id: from_stop_id,
					from_el_id: from_el_id,
					is_prev: from_start_id < 1,
					subs_count: subs_count,
					start_count: start_count,
					loaded_count: loaded_count,
					last_count: last_count,
					to_load_count: subs_count - loaded_count,
					page_number: page_number,
					next_sub_id: next_sub_id
				};
			};
			_constr_func.prototype.check2 = function () {
				var page_number = this.page_data[3],
					is_submsges = this.page_data[5][0][1],
					start_id = page_number === 1 ? this.subs_tree().start_id(is_submsges) : this.page_data[0],
					stop_id = this.page_data[8], // this.is_last() ? this.subs_tree().stop_id(is_submsges) : this.page_data[8],
					start_count = 0,
					last_count = 0,
					loaded_count = 0,
					subs_count = this.page_data[7],
					subs_tree = _msg_data["subs_tree"].subs(is_submsges),
					is_next = start_id < 1 && stop_id > 0,
					neighbour_page_obj, i_tree_obj, i_sub_id;

				if (start_id < 1 && stop_id < 1) {
					neighbour_page_obj = this.page_data[5][page_number - 1];

					if (!neighbour_page_obj) {
						neighbour_page_obj = this.page_data[5][page_number + 1];
						is_next = true;
					}

					if (!neighbour_page_obj) return {
						is_prev: true,
						to_load_count: subs_count
					};

					subs_count = subs_count + 1;

					if (is_next) {
						stop_id = neighbour_page_obj.start_id();
						last_count = last_count - 1;
					} else {
						start_id =  neighbour_page_obj.stop_id();
						start_count = start_count - 1;
					}
				}

				if (start_id > 0) {
					i_sub_id = start_id;

					while (subs_count > 0) {
						i_tree_obj = subs_tree[i_sub_id];

						if (!i_tree_obj) break;

						subs_count = subs_count - 1;
						start_count = start_count + 1;
						start_id = i_sub_id;

						i_sub_id = i_tree_obj.next_id();
					}

					if (start_count > 0) this.page_data[6] = start_count;
				}

				if (subs_count < 1 && stop_id !== start_id) {
					alert_if(start_count !== this.page_data[7], "err! _constr_func.prototype.check");

					// stop_id = this.page_data[8] = start_id;
					stop_id = start_id;
				} else if (stop_id > 0) {
					i_sub_id = stop_id;

					while (subs_count > 0) {
						i_tree_obj = subs_tree[i_sub_id];

						alert_if(start_id > 0 && i_sub_id >= start_id, "");

						if (!i_tree_obj) break;

						subs_count = subs_count - 1;
						last_count = last_count + 1;
						stop_id = i_sub_id;

						i_sub_id = i_tree_obj.prev_id();
					}

					// if (last_count < 1) {
						// stop_id = this.page_data[8] = -1;
					// }
				}

				loaded_count = start_count + last_count;

				this.page_data[1] = loaded_count > 0 ? loaded_count : this.page_data[7] * -1;

				return {
					start_id: start_id,
					stop_id: stop_id,
					from_el_id: subs_tree[start_id > 0 ? start_id : stop_id].el_id(),
					is_prev: start_id < 1,
					subs_count: this.page_data[7], // subs_count,
					start_count: start_count,
					loaded_count: loaded_count,
					last_count: last_count,
					to_load_count: this.page_data[7] - loaded_count
				};
			};
			_constr_func.prototype.check_pagem = function (is_simple) {
				var check_result = _check_tree(_msg_data["subs_tree"], this.page_data[5][0][1], this.page_data[7], this.page_data[0], is_simple);

				check_result["page_number"] = this.page_data[3];

				if (is_simple) {
					this.page_data[1] = check_result["loaded_count"] > 0 ? check_result["loaded_count"] : this.page_data[7] * -1;
					this.page_data[6] = check_result["start_count"];

					return check_result;
				}

				this.page_data[1] = check_result["loaded_count"] > 0 ? check_result["loaded_count"] : this.page_data[7] * -1;
				this.page_data[6] = check_result["start_subs_count"];

				if (check_result["loaded_count"] > 0 && !this.page_data[5][this.page_data[3]]) this.page_data[5][this.page_data[3]] = this;

				check_result["is_prev"] = check_result["is_prev"] && this.page_data[3] > 1;

				return check_result;
			}; */
			_constr_func.prototype.default_count = function () {
				return this.page_data[5][0][3];
			};
			_constr_func.prototype.undefined_pages_count = function (correction_param) {
				alert_if(this.page_data[7] < 0, "prototype.undefined_pages_count ", [this.page_data[7], this.page_data[3]]);
				my_alert("_constr_func.prototype.undefined_pages_count");
				var default_count = this.page_data[5][0][3],
					counters_arr = _msg_data["subs_tree"].counters(this.page_data[5][0][1]),
					result_val = (correction_param || 0) + this.page_data[7] - (this.page_data[1] > 0 ? this.page_data[1] : 0),
					last_page_data = this.page_data[5][this.page_data[5][0][2]].page_data;

				result_val = result_val + (last_page_data[7] - (last_page_data[1] > 0 ? last_page_data[1] : 0));

				return Math.ceil((counters_arr[2] - result_val) / default_count);
			};

			return _constr_func;
		}());

	var _init_obj = function (this_obj) {
			AAA_DEBUG_ARR["AAA_paging_data"] = [];
			// AAA_paging_data = [];

			_this_obj = this_obj;

			_data_obj = MSG_OBJ.data_obj;

			_msg_data = _data_obj.msg_data();

			_defaults = _msg_data["defaults"]["paging"];

			_els_obj = MSG_OBJ.els_obj;
			_checker_obj = MSG_OBJ.checker_obj;
				// _form_els.els_labels
			_msges_els = _els_obj.form_els["msges_els"];
			_els_labels = _els_obj.form_els.els_labels;

			_toggle_subs.is_folded = _msg_data["is_fold_subs"];

			_show_page.showed_range = [];

			// delete _paging_data["msg"];

			// if (_data_obj.is_not_locked()) _init_paging();
			_init_paging();

			return _this_obj;
		},
		_init_paging = function (mode_name, is_submsges) {
			var is_both = is_submsges !== false && is_submsges !== true,
				tree_obj = _data_obj.subs_tree(mode_name),
				page_obj_arr = [],
				is_main_mode = _is_main_mode(mode_name),
				// is_submsges_id = is_main_mode ? 0 : (is_submsges ? 1 : 0),
				// els_labels = _els_obj.form_els.els_labels,i_bar_obj,, i_is_last
				$i_subs_div_el, $i_subs_paging_el, $i_el,
				i_subs_type_id, i_subs_count, i_paging_els, i_is_submsges, i_is_reset,
				// is_reset = _paging_data[mode_name] && _paging_data[mode_name]["inter_modes_data"][is_submsges_id],
				div_ids_arr, i_is_hidden;

			mode_name = mode_name || "msg";
			mode_name = _paging_mode(mode_name);

			if (mode_name === "msg" || mode_name === "subs") div_ids_arr = [css_obj.id("msg_answers_front"), css_obj.id("msg_submsges_front"), 0];
			else if (mode_name === "drafts") div_ids_arr = [css_obj.id("msg_drafts_answers"), css_obj.id("msg_drafts_submsges"), 2];
			else if (mode_name === "trash") div_ids_arr = [css_obj.id("msg_trash_answers"), css_obj.id("msg_trash_submsges"), 4];
			else if (mode_name === "favs") div_ids_arr = [css_obj.id("msg_favs_0"), css_obj.id("msg_favs_1"), 4];

			var is_main_mode2 = is_both && mode_name === "msg";

			for (i_subs_type_id = is_main_mode2 ? 0 : (is_submsges ? 1 : 0); i_subs_type_id < (is_main_mode2 ? 2 : (is_submsges ? 2 : 1)); i_subs_type_id++) {
				i_is_submsges = i_subs_type_id > 0;

				i_subs_count = tree_obj.loaded(i_is_submsges);
				i_is_hidden = i_subs_count < 1;

				// if (i_subs_count < 1) continue;
				// if (i_subs_count < 1 && mode_name !== "msg") continue;
				if (i_is_hidden && mode_name !== "msg") continue;

				i_is_reset = _paging_data[mode_name] && _paging_data[mode_name]["inter_modes_data"][i_subs_type_id];

				if (!i_is_reset) { // if (!is_reset) {
					i_paging_els = [];

					i_paging_els["subs_div"] = _els_obj.el(mode_name + "_" + i_subs_type_id, div_ids_arr[i_subs_type_id], !i_is_hidden);
					$i_subs_div_el = i_paging_els["subs_div"][1];
					// $i_subs_div_el = $(div_ids_arr[i_subs_type_id]);
					$i_subs_paging_el = $i_subs_div_el.children(css_obj.csd("paging_el"));

					i_paging_els[0] = [false, $i_subs_paging_el.children(css_obj.csd("current_page"))];
					i_paging_els["bar"] = [false, $i_subs_paging_el];
					i_paging_els["mean_0"] = [false, i_paging_els[0][1].next("a")];
					i_paging_els["mean_1"] = [false, i_paging_els["mean_0"][1].next("a")];
					i_paging_els["prev"] = [false, $i_subs_paging_el.children("span").children(css_obj.csd("str_disable"))];
					i_paging_els["next"] = [false, i_paging_els["prev"][1].next("a")];
					i_paging_els["more_info"] = [false, $i_subs_div_el.children(css_obj.csd("msg_subs_info"))];
					i_paging_els["ul"] = [i_is_hidden, $i_subs_div_el.children("ul")];
					// i_paging_els["subs_div"] = [i_subs_count > 0, $i_subs_div_el];

					i_paging_els["subs_tls"] = $i_el = $i_subs_div_el.children(css_obj.csd("subs_tls"));
					i_paging_els["checkeds_info"] = [false, $i_el.children(css_obj.csd("checkeds_info_div"))];
					i_paging_els["toggle_subs"] = [false, $i_subs_div_el.children(is_main_mode || !is_submsges ? css_obj.csd("sub_answ_div_hide") : css_obj.csd("sub_answ_div_hide_2"))];
					// i_paging_els["checkeds_info"] = [false, $i_subs_div_el.children(css_obj.csd("checkeds_info_div"))];
					// i_paging_els["toggle_subs"] = [false, $i_subs_div_el.children(is_main_mode || !is_submsges ? css_obj.csd("sub_answ_div_hide") : css_obj.csd("sub_answ_div_hide_2"))];

					if (!i_is_submsges) i_paging_els["toggle_foto"] = [false, $i_subs_div_el.children(css_obj.csd("toggle_foto"))];

					i_paging_els["numeric_els"] = [[], []];
					i_paging_els["showed_els"] = [[], []];

					i_paging_els["toggle"] = _init_toggle_func;

					// i_paging_els["tools"] = ["sub_answ_div_hide"];
					// if (i_paging_els["toggle_foto"]) i_paging_els["tools"].push("toggle_foto");

					/* i_paging_els["toggle"] = function (el_name, is_show) {
						if (!this[el_name]) return;

						is_show = !!is_show || is_show === false ? !!is_show : !this[el_name][0];

						if (this[el_name][0] === is_show) return;

						this[el_name][0] = is_show;

						this[el_name][1].toggle(is_show);
					}; */
				}

				page_obj_arr[i_subs_type_id] = _init_paging_data(mode_name, i_is_submsges, i_paging_els);

				_set_subs_buttons(mode_name, i_is_submsges);

				if (i_subs_count > 0) _show_page(i_is_submsges, page_obj_arr[i_subs_type_id]);

				if (mode_name === "msg" || mode_name === "subs") _toggle_page_subs(mode_name, i_is_submsges, true);
			}

			return page_obj_arr;
		},
		_init_toggle_func = function (el_name, is_show) {
			if (!this[el_name]) return;

			is_show = !!is_show || is_show === false ? !!is_show : !this[el_name][0];

			if (this[el_name][0] === is_show) return;

			this[el_name][0] = is_show;

			this[el_name][1].toggle(is_show);
		},
		_init_paging_data = function (this_mode, is_submsges, paging_els) {
			var current_paging_mode = _paging_mode(),
				paging_mode = _paging_mode(this_mode),
				// mode_id = this_mode === "msg" ? 0 : (this_mode === "subs" ? 1 : (this_mode === "drafts" ? 2 : 3)),
				// is_main_modes = this_mode === "msg" || this_mode === "subs",
				subs_type_id = is_submsges ? 1 : 0,
				is_submsges_id = is_submsges ? 1 : 0,
				tree_obj = _data_obj.subs_tree(this_mode),
				default_count = _els_obj.view_count(is_submsges, this_mode), // this_mode === "msg" ? _defaults["count_main_page_subs"] : _defaults["count_subs_page"],
				msg_counters = tree_obj.counters(is_submsges),
				paging_data = _paging_data(this_mode),
				count_all_subs = msg_counters[0],
				count_loaded_subs = msg_counters[1];

			// if (count_loaded_subs < 1) return my_alert("_init_paging_data NO LOADED!");
			if (count_loaded_subs < 1) {
				if (this_mode === "msg" && !paging_data["inter_modes_data"][is_submsges_id]) paging_data["inter_modes_data"][is_submsges_id] = {
					paging_els: paging_els
				};
				return my_alert("_init_paging_data NO LOADED!");
			}
			if (!paging_data["inter_modes_data"][is_submsges_id]) paging_data["inter_modes_data"][is_submsges_id] = {
				paging_els: paging_els
			};
			////////////////

			var last_page_number = Math.ceil(count_all_subs / default_count),
				// count_undefined_subs = msg_counters[2],
				is_last = last_page_number === 1, // count_all_subs === count_loaded_subs,
				// another_subs_type_id,
				mode_data, //  = paging_data[another_subs_type_id][0] ? paging_data[another_subs_type_id][0][8] : [false]]
				new_page_obj,
				inter_modes_data,
				another_mode = this_mode === "msg" ? "subs" : (this_mode === "subs" ? "msg" : false),
				another_data = !another_mode ? false : _paging_data(this_mode === "msg" ? "subs" : "msg")[subs_type_id];

			// if (!paging_data["inter_modes_data"][is_submsges_id]) paging_data["inter_modes_data"][is_submsges_id] = {
				// paging_els: paging_els
			// }

			inter_modes_data = another_data &&  another_data[0] ? another_data[0][5] : {
				showed_range: [tree_obj.start_id(is_submsges), count_loaded_subs],
				middle_ids: is_last ? [] : [tree_obj.last_ids(is_submsges)[1]],
				paging_els: paging_els || paging_data["inter_modes_data"][is_submsges_id]["paging_els"],
				tree_obj: tree_obj,
				last_showed: [this_mode, is_submsges],
				last_showed_page_obj: [],
				subs_to_load: [[],[]]
			};

			mode_data = paging_data["mode_data"];

			// another_data = paging_data[is_submsges ? 0 : 1];

			// mode_data = another_data && another_data[0] ? another_data[0][8] : {
				// is_submsges: -1							//
			// };

			// paging_data["inter_modes_data"][is_submsges_id] = ;


			paging_data[subs_type_id][0] = [
				this_mode,								// 00:
				is_submsges,							// 01:
				last_page_number,						// 02:
				default_count,							// 03:
				1,										// 04: current_page
				inter_modes_data,						// 05:
				is_last ? [] : [1, last_page_number],	// 06: middle_page
				tree_obj,								// 07:
				mode_data,								// 08:
				another_data && another_data[0],		// 09: paging_mode === "subs",// !== "msg", // is_main_modes,	// is_changed
				false,									// 10: is_folded
				another_mode							// 11: another_mode
			];

			new_page_obj = paging_data[subs_type_id][1] = new _page_class(
				1,
				tree_obj.start_id(is_submsges),
				count_loaded_subs,
				is_last ? count_loaded_subs : default_count,
				paging_data[subs_type_id],
				is_last,
				is_last ? count_loaded_subs : default_count,
				is_last ? count_loaded_subs : default_count,
				tree_obj.last_ids(is_submsges)[1]
			);

			// !!!!!!!!!!!!!!04.09.13!!!!!!!!!!!!!!
			// if (is_last && current_paging_mode !== "subs" && current_paging_mode === paging_mode)
			if (is_last && current_paging_mode === paging_mode) {
				my_alert("_init_paging_data is_last " + [count_all_subs, default_count, tree_obj.last_ids(is_submsges)[1], tree_obj.stop_id(is_submsges)]);
				paging_data[subs_type_id][1].stop_id(tree_obj.last_ids(is_submsges)[1]);
			}
			// !!!!!!!!!!!!!!04.09.13!!!!!!!!!!!!!!

			if (!is_last) paging_data[subs_type_id][last_page_number] = new _page_class(
				last_page_number,
				null_val,
				(count_all_subs - (default_count * (last_page_number - 1))) * -1,
				count_all_subs,
				paging_data[subs_type_id],
				true,
				null_val,
				(count_all_subs - (default_count * (last_page_number - 1)))
			);

			return paging_data[subs_type_id][1];
		},

		_paging_mode = function (this_mode) {
			this_mode = this_mode || dsk_mode();

			if (this_mode === "answers" || this_mode === "submsges") this_mode = "subs";

			return this_mode;
		},
		_paging_data = function (this_mode, is_submsges, is_reset) {
			this_mode = _paging_mode(this_mode);

			var is_submsges_id = is_submsges ? 1 : (is_submsges === false ? 0 : -1),
				paging_data = _paging_data[this_mode],
				another_mode = this_mode === "msg" ? "subs" : (this_mode === "subs" ? "msg" : false),
				another_paging_data;

			if (!paging_data) {
				paging_data = _paging_data[this_mode] = [[], []];
				paging_data["this_mode"] = this_mode;
				paging_data["another_mode"] = another_mode;

				if (another_mode && _paging_data[another_mode]) paging_data["inter_modes_data"] = _paging_data[another_mode]["inter_modes_data"];
				else paging_data["inter_modes_data"] = [];

				paging_data["mode_data"] = {
					this_mode: this_mode,
					another_mode: another_mode,
					inter_modes_data: paging_data["inter_modes_data"],
					is_submsges: -1
				};

				// paging_data["is_submsges"] = -1; // this_mode === "msg" ? -1 : (is_submsges ? 1 : 0);
			}

			err_if(paging_data["this_mode"] !== this_mode, "_paging_data: " + this_mode);

			if (is_reset) {
				paging_data[is_submsges_id] = [];

				another_paging_data = another_mode && _paging_data[another_mode] ? _paging_data[another_mode] : false;

				if (another_paging_data) another_paging_data[is_submsges_id] = [];

				paging_data["mode_data"]["is_submsges"] = -1;

				// paging_data[is_submsges_id]["is_reset"] = true;

				// if (this_mode === "msg" || this_mode === "subs") {
					// paging_data = _paging_data[this_mode === "msg" ? "subs" : "msg"];

					// paging_data[is_submsges_id] = [];
					// paging_data[is_submsges_id]["is_reset"] = true;
				// }
			}

			AAA_DEBUG_ARR["AAA_paging_data"][this_mode] = paging_data;
			// AAA_paging_data[this_mode] = paging_data;

			return is_submsges_id > -1 ? paging_data[is_submsges_id] : paging_data;

			// return _paging_data[this_mode];
			// return is_submsges || is_submsges === false ? _paging_data[this_mode][is_submsges ? 1 : 0] : _paging_data[this_mode];
		},
		_paging_mode_data = function (mode_name, param_name) {
			mode_name = _paging_mode(mode_name);

			var mode_data = _paging_data[mode_name] ?  _paging_data[mode_name]["mode_data"] : false;

			return mode_data && param_name ? mode_data[param_name] : mode_data;
		},
		_paging_els = function (mode_name, is_submsges) {
			var mode_data = _paging_mode_data(mode_name, "inter_modes_data") || [];

			mode_data = mode_data[is_submsges ? 1 : 0];

			if (mode_data) return mode_data["paging_els"];
		},

		_is_main_mode = function (this_mode) {
			return dsk_mode.is_main_mode(this_mode || _paging_mode());
		},

		_get_page = function (is_submsges, page_number, this_mode) {
			this_mode = _paging_mode(this_mode);

			var paging_data = _paging_data(this_mode),
				is_both = is_null(is_submsges);

			if (is_both) {
				break_test.force(paging_data, "_get_page: is_submsges = undefined!");

				if (this_mode === "msg" || this_mode === "subs") is_submsges = false;
				else if (paging_data["is_submsges"] === -1) return;
				else is_submsges = paging_data["is_submsges"] > 0;

				// is_submsges = is_defined(paging_data[1][0]);

				// if (!is_submsges && !paging_data[0][0]) return;

				// is_submsges = paging_data[is_submsges ? 1 : 0][0][8][0];
			}

			paging_data = paging_data[is_submsges ? 1 : 0];

			var default_count = _els_obj.view_count(is_submsges, this_mode), // mode_id === 0 ? _defaults["count_main_page_subs"] : _defaults["count_subs_page"],
				// mode_id = this_mode === "msg" ? 0 : (this_mode === "subs" ? 1 : (this_mode === "drafts" ? 2 : 3)),
				tree_obj = _data_obj.subs_tree(this_mode),
				msg_counters = tree_obj.counters(is_submsges),
				count_all_subs = msg_counters[0],
				current_page_number = !paging_data[0] ? 1 : paging_data[0][4],
				is_neighbour;

			if (page_number) {
				is_neighbour = page_number === "prev" ? -1 : (page_number === "next" ? 1 : 0);

				page_number = page_number && is_neighbour === 0 ? page_number : paging_data[0][4] + is_neighbour;

				page_number = page_number > 0 ? page_number : paging_data[0][4];

				if (page_number === "last") page_number = Math.ceil(count_all_subs / default_count);
			} else page_number = !paging_data[0] ? 1 : current_page_number;

			if (is_defined(paging_data[page_number])) return paging_data[page_number];

			if (page_number === 1) return _init_paging_data(this_mode, is_submsges);

			var direction_val = !paging_data[page_number - 1] ? -1 : 1,
				neighbour_page_obj = paging_data[page_number - direction_val],
				global_counter = neighbour_page_obj ? (neighbour_page_obj.counter() + (direction_val < 0 ? neighbour_page_obj.subs_count() * -1 : default_count)) : 0;

			err_if(!neighbour_page_obj, "_get_page: MAYBE it's NOT ERR! !neighbour_page_obj " + [direction_val, page_number]);

			return new _page_class (
				page_number,
				null_val,
				null_val,
				global_counter,	// neighbour_page_obj.counter() + (direction_val < 0 ? neighbour_page_obj.subs_count() * -1 : default_count),
				paging_data,
				false,
				null_val,
				default_count
			);
		},
		_get_page_number = function (is_submsges, sub_number, mode_name) {
			var pages_data = _paging_data(mode_name),
				last_page_number,
				i_page, i_page_obj;

			pages_data = pages_data[is_submsges ? 1 : 0];

			if (!sub_number) return pages_data[0][4];

			for (i_page = 1, last_page_number = pages_data[0][2] + 1; i_page < last_page_number; i_page++) {
				i_page_obj = pages_data[i_page];
				if (i_page_obj && (i_page_obj.start_id() === -1 || sub_number <= i_page_obj.start_id()) && sub_number >= i_page_obj.stop_id()) return i_page_obj.page_number();
			}
		},
		_set_global_counter = function (page_obj, subs_counter) {
			var page_number = page_obj.page_number(),
				pages_data = page_obj.pages_data(true),
				// is_submsges = pages_data[0][1],
				last_page_number = pages_data[0][2],
				delta_val = subs_counter - page_obj.counter();

			for (var i_page = page_number, i_page_obj; i_page <= last_page_number; i_page++) {
				i_page_obj = pages_data[i_page] || false;

				if (!i_page_obj) {
					i_page = last_page_number;

					i_page_obj = pages_data[i_page];

					while (i_page_obj)	{
						i_page_obj.counter(i_page_obj.counter() + delta_val);

						i_page = i_page - 1;

						i_page_obj = pages_data[i_page] || false;
					}

					break;
				}

				i_page_obj.counter(i_page_obj.counter() + delta_val);
			}

			// my_alert("_set_global_counter");
		},

		_check_pages = function (this_mode, is_submsges, is_hhhhhh, is_changed) {
			this_mode = this_mode || dsk_mode();

			if (this_mode === "msg" && _els_obj.view_count(is_submsges, "msg") < 1) {
				return _toggle_page_subs("msg", is_submsges, true);
			}

			is_submsges = this_mode === "submsges" || (this_mode === "answers" ? false : is_submsges);

			var subs_count_arr = _data_obj.subs_count(this_mode),
				mode_data = _paging_mode_data(this_mode),
				inter_modes_data = mode_data["inter_modes_data"] || [],
				is_both = is_submsges !== false && is_submsges !== true,
				is_submsges_id = is_both ? mode_data["is_submsges"] : (is_submsges ? 1 : 0),
				result_arr = [],
				i_is_submsges_id, i_subs_count, i_page_obj,
				is_main_mode = dsk_mode.is_main_mode(this_mode),
				is_to_load_more_arr, i_check_result, i_is_init, i_is_reset, i_is_submsges;

			is_both = is_both && is_submsges_id === -1;

			for (i_is_submsges_id = is_both ? 0 : is_submsges_id; i_is_submsges_id < (is_both ? 2 : is_submsges_id + 1); i_is_submsges_id++) {
				i_subs_count = subs_count_arr[i_is_submsges_id] || 0;

				if (i_subs_count < 1) continue;

				i_page_obj = _get_page(i_is_submsges_id > 0, 1, this_mode);

				if (i_page_obj) {
					if (!is_both || this_mode === "msg" || !result_arr[0]) {
						if (!is_both && is_hhhhhh) i_page_obj.is_changed(true, true);
						result_arr[i_is_submsges_id] = _recalc_pages(i_page_obj);
					}
				} else {
					if (!is_both || this_mode === "msg" || !result_arr[0]) {
						result_arr[i_is_submsges_id] = [];

						result_arr[2] = result_arr[2] || [];
						result_arr[2][i_is_submsges_id] = !!inter_modes_data[i_is_submsges_id];
					}
				}
			}

			for (i_is_submsges_id = 0; i_is_submsges_id < 2; i_is_submsges_id++) {
				i_is_submsges = i_is_submsges_id > 0;
				i_check_result = result_arr[i_is_submsges_id];

				if (!i_check_result) continue;

				i_is_reset = result_arr[2] && result_arr[2][i_is_submsges_id];
				i_is_init = !i_is_reset && i_check_result.length < 1;

				if (!i_is_init && !i_is_reset) {
					i_page_obj = i_check_result[1];
					_toggle_page_subs(this_mode, i_is_submsges, true);
				}

				if (i_is_init || i_is_reset || i_check_result[0]["to_load_count"] > 0) {
					is_to_load_more_arr = is_to_load_more_arr || [];
					is_to_load_more_arr[i_is_submsges_id] = [i_is_submsges_id, i_is_init, i_check_result, i_is_reset];
					continue;
				}

				if (!is_main_mode && !is_changed) {

					i_page_obj.is_last_showed(true);
					continue;
				}

				if (i_page_obj.is_last_showed()) continue;

				my_alert("_toggle_menu_subs: !is_last_showed");

				_show_page(i_is_submsges, i_page_obj);
			}

			return is_to_load_more_arr;
		},
		/* _check_pages44442 = function (this_mode, is_submsges) {
			this_mode = this_mode || dsk_mode();
			is_submsges = this_mode === "submsges" || (this_mode === "answers" ? false : is_submsges);

			var subs_count_arr = _data_obj.subs_count(this_mode),
				mode_data = _paging_mode_data(this_mode),
				inter_modes_data = mode_data["inter_modes_data"] || [],
				last_is_submsges_id = mode_data["is_submsges"],
				is_both = is_submsges !== false && is_submsges !== true,
				result_arr = [],
				i_is_submsges_id, i_subs_count, i_page_obj;

			for (i_is_submsges_id = is_both || !is_submsges ? 0 : 1; i_is_submsges_id < (is_both || is_submsges ? 2 : 1); i_is_submsges_id++) {
				i_subs_count = subs_count_arr[i_is_submsges_id] || 0;

				if (i_subs_count < 1) continue;

				i_page_obj = _get_page(i_is_submsges_id > 0, 1, this_mode);

				if (i_page_obj) {
					if (this_mode === "msg" || !is_both || i_page_obj.is_last_showed()) {
						if (is_both && result_arr[0]) {
							delete result_arr[0];
							delete result_arr[2];
						}

						result_arr[i_is_submsges_id] = _recalc_pages(i_page_obj);
					}
				} else {
					if (this_mode === "msg" || !is_both || !result_arr[0]) {
						result_arr[i_is_submsges_id] = [];

						result_arr[2] = result_arr[2] || [];
						result_arr[2][i_is_submsges_id] = !!inter_modes_data[i_is_submsges_id];
						// result_arr[2][i_is_submsges_id] = !!_paging_data(this_mode)["inter_modes_data"][i_is_submsges_id];
					}
				}
			}

			err_if(result_arr.length < 1, "_check_pages: !check_result");

			return result_arr;

			// return result_arr.length > 0 ? result_arr : false;

			if (this_mode === "msg" || this_mode === "answers") i_submsges_id = 0;
			else if (this_mode === "submsges") i_submsges_id = 1;
			else i_submsges_id = is_submsges_id > -1 ? is_submsges_id : 0;

			if (subs_count_arr[i_submsges_id] > 0) {
				i_page_obj = _get_page(i_submsges_id > 0, 1, this_paging_mode);
				result_arr[i_submsges_id] = _recalc_pages(i_page_obj) || [];
			}

			if (this_mode !== "msg") return result_arr.length > 0 ? result_arr : false;

			i_submsges_id = 1;

			if (subs_count_arr[i_submsges_id] > 0) {
				i_page_obj = _get_page(i_submsges_id > 0, 1, this_paging_mode);
				result_arr[i_submsges_id] = _recalc_pages(i_page_obj) || [];
			}

			return result_arr.length > 0 ? result_arr : false;
			for (i_submsges_id = this_mode === "submsges" ? 1 : 0; i_submsges_id <= (this_mode === "answers" ? 0 : 1); i_submsges_id++) {
				if (subs_count_arr[i_submsges_id] > 0) {
					i_page_obj = _get_page(i_submsges_id > 0, 1, this_paging_mode);
					result_arr[i_submsges_id] = _recalc_pages(i_page_obj) || [];
				}

				// i_page_obj = _get_page(i_submsges_id > 0, 1, this_paging_mode);

				// if (i_page_obj) {
					// i_another_pages_data = i_page_obj.another_pages_data();
					// i_another_is_changed = i_another_pages_data && i_another_pages_data[9];

					// if (i_another_is_changed) i_another_pages_data[9] = false;

					// result_arr[i_submsges_id] = i_another_is_changed ? _recalc_pages(i_page_obj) : [
						// {
							// "to_load_count": 0
						// },
						// i_page_obj
					// ];

					// result_arr[i_submsges_id] = _recalc_pages(i_page_obj);

				// } else if (this_paging_mode !== "subs") result_arr[i_submsges_id] = [];
			}

			return result_arr.length > 0 ? result_arr : false;
		}, */
		_recalc_pages = function (page_obj) {
			if (!page_obj) return;

			// var another_pages_data = page_obj.another_pages_data(),
				// another_is_changed = another_pages_data && another_pages_data[9],
			// var is_changed = page_obj.is_changed();

			if (!page_obj.is_changed()) return [
				{
					"to_load_count": 0 // ,
					// "page_obj": page_obj
				},
				page_obj
			];

			my_alert("_recalc_pages: is_changed->" + page_obj.is_changed() + " is_submsges->" + page_obj.pages_data(true)[0][1] + " this_mode->" + page_obj.this_mode());

			page_obj.is_changed(false);

			/* if (!another_is_changed) return [
				{
					"to_load_count": 0
				},
				page_obj
			];

			another_pages_data[9] = false;

			var is_changed_mode = another_is_changed && another_is_changed !== "msg" && another_is_changed !== "subs" ? another_is_changed : false,
			 */

			var this_mode = page_obj.this_mode(),
				page_number = 0,
				pages_data = page_obj.pages_data(true),
				is_submsges = pages_data[0][1],
				tree_obj = page_obj.subs_tree(),
				// subs_tree = tree_obj.subs(is_submsges),
				msg_counters = tree_obj.counters(is_submsges),
				count_undefined_subs = msg_counters[2],
				count_all_subs = msg_counters[0],
				last_page_number = pages_data[0][2],
				// old_last_page_number = last_page_number,
				current_page_number = pages_data[0][4],
				// r_middle_page = pages_data[0][6][1],
				middle_pages = pages_data[0][6],
				prev_middle_pages = [pages_data[0][6][0], pages_data[0][6][1], last_page_number],
				middle_id = page_obj.middle_id(true),
				// showed_range_arr = pages_data[0][5]["showed_range"],
				// last_showed_page_obj = page_obj.last_showed(),
				count_undefined_pages,
				default_count = page_obj.default_count(),
				subs_counter = 0,
				loaded_counter = 0,
				right_middle_undefined_count = -1,
				// right_middle_page,check_result, temp_page,
				temp_val, is_last,
				i_subs_count, i_stop_id, i_new_stop_id, i_start_id, i_page, i_check_result, i_loaded,
				// i_flag,i_loaded_count, , i_is_changed
				j_page, is_middle, is_middled, i_page_obj;

			err_if(!pages_data[last_page_number], "_recalc_pages: !pages_data[last_page_number] " + [this_mode, last_page_number]);
			pages_data[last_page_number].is_last(false);

			while (!is_last) {
				page_number = page_number + 1;

				/* if (count_all_subs < 1) {
					delete pages_data[page_number];
					is_last = page_number === last_page_number;
					continue;
				}	 */

				i_page_obj = pages_data[page_number] || _get_page(is_submsges, page_number, this_mode);

				i_subs_count = i_page_obj.subs_count();
				i_stop_id = i_page_obj.stop_id();

				if (i_subs_count < default_count) i_subs_count = default_count;
				if (subs_counter + i_subs_count > count_all_subs) i_subs_count = count_all_subs - subs_counter;

				i_page_obj.subs_count(i_subs_count, true);

				subs_counter = subs_counter + i_subs_count;
				i_page_obj.counter(subs_counter);

				err_if(subs_counter > count_all_subs, "_recalc_pages: subs_counter > count_all_subs " + [subs_counter, count_all_subs]);

				is_last = subs_counter === count_all_subs;

				// my_alert([page_number, subs_counter, count_all_subs]);

				if (page_number > 1) {
					i_start_id = !is_middle || right_middle_undefined_count > 0 ? false : middle_id;
					i_page_obj.start_id(i_start_id);
				}

				//??????????????? 09/04/2014 is it critical?
				if (is_last) {
					i_page_obj.is_last(true);
					last_page_number = page_number;
				}

				if (!is_middle || right_middle_undefined_count < 1) i_page_obj.stop_id(false);
				else i_page_obj.stop_id(middle_id, i_subs_count - right_middle_undefined_count);

				// if (is_last) {
					// i_page_obj.is_last(true);
					// last_page_number = page_number;
				// }
				//??????????????? 09/04/2014

				// break_test(i_page_obj, "_recalc_pages");

				i_check_result = i_page_obj.check(true);

				// break_test(i_page_obj, "_recalc_pages");

				i_new_stop_id = i_page_obj.stop_id();

				// i_flag = is_changed_mode && current_page_number === page_number && i_new_stop_id > i_stop_id && i_stop_id > 0;

				// alert_if(i_flag, "1W ", showed_range_arr[0], showed_range_arr[1], showed_range_arr[2], i_stop_id, i_new_stop_id);

				// i_flag = i_flag && showed_range_arr[0] >= i_stop_id && showed_range_arr[2] <= i_stop_id;
				// i_flag = i_flag && showed_range_arr[0] >= i_new_stop_id && showed_range_arr[2] <= i_new_stop_id;

				// if (i_flag) showed_range_arr[1] = showed_range_arr[1] + tree_obj.subs_distance(is_submsges, i_new_stop_id, i_stop_id);

				// alert_if(i_flag, "2W ", showed_range_arr[0], showed_range_arr[1], showed_range_arr[2]);

				i_loaded = i_page_obj.loaded();

				loaded_counter = loaded_counter + i_loaded;

				if (!is_middled && i_loaded > 0) {
					if (middle_pages[0] < page_number) middle_pages[0] = page_number;
					if (middle_pages[1] < page_number) middle_pages[1] = page_number;
				}

				is_middle = !is_middled && !(i_page_obj.stop_id() > 0 || is_last);

				if (is_middle) {
					alert_if(is_middled || is_last, "err! _check_pages_0", page_number, right_middle_undefined_count);

					is_middled = true;

					count_undefined_pages = Math.floor((count_undefined_subs - (subs_counter - loaded_counter)) / default_count);
					subs_counter = subs_counter + count_undefined_pages * default_count;
					page_number = page_number + count_undefined_pages + 1;

					if (subs_counter === count_all_subs) {

						my_alert("_check_pages: del last page!" + page_number);

						page_number = page_number - 1;
						subs_counter = subs_counter - default_count;
					}

					right_middle_undefined_count = (count_all_subs - subs_counter) - (msg_counters[1] - loaded_counter);

					alert_if(right_middle_undefined_count < 0, "err! _check_pages_3", page_number, right_middle_undefined_count);

					if (prev_middle_pages[1] > middle_pages[0] && prev_middle_pages[1] !== page_number && pages_data[prev_middle_pages[1]]) {
						for (i_page = prev_middle_pages[1], j_page = page_number, temp_val = 0; i_page <= prev_middle_pages[2]; i_page++) {
							if (temp_val < 1 && i_page === current_page_number) temp_val = j_page;

							pages_data[j_page] = pages_data[i_page];
							pages_data[j_page].page_number(j_page);

							delete pages_data[i_page];

							i_page = i_page + 1;
							j_page = j_page + 1;
						}

						// if (temp_val > 0) current_page_number = temp_val;
					}

					middle_pages[1] = page_number;
					page_number = page_number - 1;
				}
			}

			if (middle_pages[0] === middle_pages[1]) pages_data[0][6] = [];

			alert_if(last_page_number !== page_number, "last_page_number !== page_number", [last_page_number, page_number]);

			if (prev_middle_pages[0] < middle_pages[1]) for (i_page = middle_pages[0] + 1; i_page <= prev_middle_pages[0]; i_page++) delete pages_data[i_page];
			if (prev_middle_pages[1] > middle_pages[0]) for (i_page = prev_middle_pages[1]; i_page < middle_pages[1]; i_page++) delete pages_data[i_page];
			for (i_page = page_number + 1; i_page <= prev_middle_pages[2]; i_page++) delete pages_data[i_page];

			while (!pages_data[current_page_number]) current_page_number = current_page_number - 1;
			pages_data[0][4] = current_page_number;
			//// ???!!!
			// pages_data[current_page_number].show_range(true);
			//// ???!!!
			// pages_data[current_page_number].is_changed(false);
			// var another_pages_data = pages_data[current_page_number].another_pages_data();
			// if (another_pages_data) another_pages_data[0][9] = false;

			pages_data[current_page_number].is_last_showed(false);

			return [
				pages_data[current_page_number].check(),
				pages_data[current_page_number],
				true // is_recalcked
			];
		},

		_check_changes = function (page_obj, chain_arr) {
			if (!page_obj) return;

			var is_submsges = page_obj.is_submsges(),
				tree_obj = page_obj.tree_obj(),
				this_mode = page_obj.this_mode(),
				change_arr = tree_obj.subs_to_change(is_submsges),
				change_arr_len = change_arr[0] || 0,
				change_sub_subs_arr = tree_obj.subs_to_change(is_submsges, -1),
				change_sub_subs_arr_len = change_sub_subs_arr[0] || 0;

			if (change_arr_len < 2 && change_sub_subs_arr_len < 1) return;

			var change_info = change_arr[2][0][1],
				result_arr = [[change_info[0], change_info[1], change_info[2], change_info[3] || 0, change_info[4] || 0]],
				// i_msg_id, i_sub_number,i_before_count,i_childs_count,
				is_msg_ids, i_new_sub, i_result_arr, i_change_arr, i_id, i_sub_id, i_push_arr, i_is_remove, i_tree_obj,
				i_parent_el_id, i_parent_arr, i_chain_arr, i_subs_type_id, i_before_sub_number, i_change_data_arr, i_childs_arr;

			if (!(change_arr[0] > 1 || change_info[1] > 0 || change_info[2] > 0 || change_info[3] > 0 || change_info[4] > 0 || change_info[5] > 0)) return;

			// break_test(result_arr, "_check_changes: " + this_mode);

			for (i_id = 0; i_id < change_sub_subs_arr_len; i_id++) {
				i_parent_el_id = change_sub_subs_arr[1][i_id];
				if (!(i_parent_el_id > 0)) continue;

				i_childs_arr = change_sub_subs_arr.push_id(i_parent_el_id);
				i_tree_obj = _data_obj.msg_data(i_parent_el_id, "subs_tree");

				if (!chain_arr) chain_arr = [[], []];

				for (i_subs_type_id = 0; i_subs_type_id < 2; i_subs_type_id++) {
					if (i_childs_arr[i_subs_type_id][0] > 0) {
						i_chain_arr = chain_arr[is_submsges ? 1 : 0].push_id(i_parent_el_id) || chain_arr[is_submsges ? 1 : 0].push_id(i_parent_el_id, []);
						i_chain_arr = i_chain_arr[i_subs_type_id] = [3, "el", i_parent_el_id, i_subs_type_id, [[], []], []];

						for (i_sub_id = 0; i_sub_id < i_childs_arr[i_subs_type_id][0]; i_sub_id++) {
							i_before_sub_number = i_childs_arr[i_subs_type_id][1][i_sub_id];
							i_push_arr = i_childs_arr[i_subs_type_id].push_id(i_before_sub_number);
							i_before_sub_number = i_before_sub_number > 0 ? i_before_sub_number : -1;

							i_chain_arr[4][0].push(i_before_sub_number);
							i_chain_arr[4][1][i_before_sub_number] = i_push_arr;
						}

						i_chain_arr[5] = i_childs_arr[i_subs_type_id + 2];
					}

					if (i_childs_arr[i_subs_type_id + 4] > 0) {
						my_alert("_check_changes: subs after count=" + this_mode + i_childs_arr[i_subs_type_id + 4]);

						i_tree_obj.count(i_subs_type_id > 0, i_childs_arr[i_subs_type_id + 4]);

						_set_sub_subs_info(i_parent_el_id, [i_subs_type_id === 0, i_subs_type_id > 0], i_tree_obj.showed(this_mode !== "msg"));
					}
				}
			}

			if (change_sub_subs_arr_len > 0) {
				if (chain_arr[0][0] || chain_arr[1][0]) result_arr[5] = chain_arr;
				change_sub_subs_arr.push_id(false);
			}

			for (i_id = 0; i_id < change_arr_len; i_id++) {
				i_sub_id = change_arr[1][i_id];
				if (!(i_sub_id > 0)) continue;

				change_arr[0] -= 1;

				i_change_arr = change_arr[2][i_sub_id][1];

				i_is_remove = !i_change_arr[0];
				i_change_data_arr = i_change_arr[1];

				err_if(!i_change_data_arr, "_check_changes1");

				i_result_arr = result_arr[i_is_remove ? 1 : 2];

				if (i_is_remove) { // to_remove_arr		for favs only????!!!
					break_test.force(i_change_data_arr, "_check_changes: to_remove_arr " + this_mode);

					// if (!i_result_arr) i_result_arr = result_arr[1] = [[],[]];
					if (!i_result_arr) i_result_arr = result_arr[1] = [];

					change_info[3] -= 1;

					// i_parent_el_id = i_change_data_arr[2];
					i_parent_el_id = i_change_data_arr[0];

					i_parent_arr = i_result_arr.push_id(i_parent_el_id) || i_result_arr.push_id(i_parent_el_id, [[]]);

					i_parent_arr[0].push_id(i_change_data_arr[1], [i_change_data_arr[2]["is_msg"], i_change_data_arr[2]["is_msg"], i_change_data_arr[2]["sub_number"]]);

					// if (!i_result_arr[1][i_parent_el_id]) {
						// i_result_arr[0].push(i_parent_el_id);
						// i_result_arr[1][i_parent_el_id] = [];
					// }

					// i_result_arr[1][i_parent_el_id].push([
						// i_change_data_arr[1],
						// i_change_data_arr[3],
						// i_change_data_arr[0]
					// ]);
				} else { // to_load_arr
					if (!i_result_arr) i_result_arr = result_arr[2] = [[], [[],[]], [[],[]], []];

					i_before_sub_number = i_change_data_arr[0];
					i_new_sub = i_before_sub_number === -1;

					is_msg_ids = is_msg_ids || !!i_change_data_arr[1];
					if (is_msg_ids) i_sub_id = i_change_data_arr[1];

					change_info[i_before_sub_number === -2 ? 2 : 1] -= 1;

					if (!i_new_sub) i_result_arr[i_before_sub_number === -2 ? 3 : 0].push(i_sub_id);

					if (!i_result_arr[1][1][i_before_sub_number]) {
						i_result_arr[1][0].push(i_before_sub_number);
						i_result_arr[1][1][i_before_sub_number] = [!i_new_sub ? i_sub_id : false];
					} else if (!i_new_sub) i_result_arr[1][1][i_before_sub_number].push(i_sub_id);

					if (i_before_sub_number > -2) {
						if (!i_result_arr[2][1][i_before_sub_number]) {
							i_result_arr[2][0].push(i_before_sub_number);
							i_result_arr[2][1][i_before_sub_number] = [!i_new_sub ? i_sub_id : false];
						} else if (i_before_sub_number !== -1) i_result_arr[2][1][i_before_sub_number].push(i_sub_id);
					}
				}
			}

			result_arr[4] = is_msg_ids;

			err_if(change_arr[0] > 1 || change_info[1] > 0 || change_info[2] > 0 || change_info[3] > 0, "_check_changes ", change_arr[0], change_info);

			change_arr.push_id(false);

			break_test(result_arr, "_check_changes: result_arr");

			return result_arr;
		},

		_append_subs = function (el_id, is_submsges, subs_count) {
			var is_main_parent = el_id === 0;

			return is_main_parent ? _append_page(is_submsges, subs_count) : _append_sub_subs(is_submsges, el_id, subs_count);
		},
		_append_page = function (is_submsges, append_count, ids_params) {
			append_count = append_count > 0 ? append_count : _data_obj.view_count();
			// if (_data_obj.is_values("is_view_subs")[is_submsges ? 1 : 0] === "gallery") append_count = _data_obj.view_count(is_submsges, "msg");

			if (ids_params) my_alert("err! _append_page");//return _append_page_2(page_obj, append_count, ids_params);

			var page_obj = _get_page(is_submsges),
				pages_data = page_obj.pages_data(true),
				tree_obj = page_obj.subs_tree(),
				page_number = page_obj.page_number(),
				last_page_number = pages_data[0][2],
				view_type = _data_obj.is_values("is_view_subs")[is_submsges ? 1 : 0],
				// start_count = page_obj.start_count(),
				check_result, // = page_obj.check_page(),
				// stop_id = page_obj.stop_id(),, is_last
				default_count = page_obj.default_count(),
				middle_pages = pages_data[0][6],
				temp_page, temp_val,
				shift_arr = [],
				subs_counter = page_obj.counter() - page_obj.subs_count();//i_subs_count

			if (view_type === "gallery") append_count = _data_obj.view_count(is_submsges, "msg");
			else if (view_type === "gallery_uno") append_count = 4;

			is_submsges = pages_data[0][1];

			for (var i_page = page_number, i_page_obj, i_next_page_obj, i_shift_arr; i_page <= last_page_number; i_page++) {
				i_page_obj = pages_data[i_page];
				i_next_page_obj = pages_data[i_page + 1] || false;

				if (i_next_page_obj) {
					i_shift_arr = i_next_page_obj.shift(append_count);

					append_count = i_shift_arr[5];

					if (i_page === page_number) shift_arr = i_shift_arr;

					if (i_page_obj.is_full()) i_page_obj.start_count(i_shift_arr[1]);

					subs_counter = subs_counter + i_page_obj.subs_count(append_count);

					i_page_obj.counter(subs_counter);

					i_page_obj.loaded(i_shift_arr[1] + i_shift_arr[2]);

					if (i_next_page_obj.is_last() && i_next_page_obj.subs_count() < 1) {

						if (last_page_number === middle_pages[1]) middle_pages[1] = middle_pages[1] - 1;

						i_page_obj.is_last(true);

						delete pages_data[last_page_number];

						last_page_number = last_page_number - 1;
					}

					i_page_obj.stop_id(i_shift_arr[0]);

					append_count = i_next_page_obj.append_count();

					if (append_count > 0 || i_next_page_obj.subs_count() < 1) continue;

					break;
				}

				alert_if(i_page === last_page_number, "_append_page1 ?" + i_page);

				temp_val = i_page > page_number && i_page_obj.loaded() < 1;

				if (temp_val) {
					delete pages_data[i_page];

					middle_pages[0] = middle_pages[0] - 1;

					subs_counter = subs_counter + default_count;

		/*			if (i_page === last_page_number) {
						last_page_number = last_page_number - 1;
							my_alert("_append_page ?" + i_page);
						pages_data[last_page_number].is_last(true);

						break;
					}	 */
				}

				// temp_page = last_page_number;
				// while (pages_data[temp_page]) temp_page = temp_page - 1;

				temp_page = middle_pages[1] - 1;

				pages_data[temp_page] = _get_page(is_submsges, temp_page);

				i_shift_arr = pages_data[temp_page].shift(append_count);

				if (!temp_val) {
					subs_counter = subs_counter + i_page_obj.subs_count(append_count);

					i_page_obj.counter(subs_counter);

					//if (i_page === page_number)
					i_page_obj.stop_id(false);
				}

				subs_counter = subs_counter + (temp_page - i_page - 1) * default_count;

				middle_pages[1] = temp_page;

				i_page = temp_page - 1;
			}

			if (temp_page > 0 && temp_page !== last_page_number && pages_data[temp_page].loaded() < 1) {
				delete pages_data[temp_page];
				middle_pages[1] = temp_page + 1;
			}


			// WHY THE SAME?????!!!!

			my_alert(shift_arr);


			if (shift_arr[1] > 0) {
				// _show_subs(false, [shift_arr[3], shift_arr[1]], (dsk_mode() === "msg" ? 0 : 1), _msg_data["subs_tree"].subs(is_submsges), is_submsges);
				_show_subs(false, [shift_arr[3], shift_arr[1], shift_arr[6]], (dsk_mode() === "msg" ? 0 : 1), tree_obj.subs(is_submsges), is_submsges);
				// my_alert(shift_arr);
				// _els_obj.check_sub(0, is_submsges);
			}

			if (shift_arr[2] > 0) {
				_show_subs(false, [shift_arr[3], shift_arr[1], shift_arr[6]], (dsk_mode() === "msg" ? 0 : 1), tree_obj.subs(is_submsges), is_submsges);

				//_show_subs(false, [shift_arr[3], shift_arr[1]], (dsk_mode() === "msg" ? 0 : 1), _msg_data["subs_tree"].subs(is_submsges), is_submsges);

				// _els_obj.check_sub(0, is_submsges);
			}

			page_obj.show_range(true);

			_set_bar(page_obj);

			check_result = page_obj.check(true);

			check_result["page_obj"] = page_obj;

			return check_result["to_load_count"] > 0 ? check_result : false;
		},
		_append_sub_subs = function (is_submsges, parent_el_id, loaded_count) {
			var mode_id = dsk_mode() === "msg" ? 0 : 1,
				is_subs_mode = mode_id > 0,
				sub_data = _data_obj.msg_data(parent_el_id),
				tree_obj = sub_data["subs_tree"],
				is_main_subs = sub_data["parent_el_id"] < 1,
				is_view_subs = _data_obj.is_values("is_view_subs")[is_submsges ? 1 : 0],
				counters_arr = tree_obj.counters(is_submsges),
				showed_count = tree_obj.showed(is_subs_mode, is_submsges),
				is_first_load = counters_arr[1] < 1,
				// default_count = _data_obj.view_count(is_submsges) > counters_arr[0] ? counters_arr[0] : _data_obj.view_count(is_submsges),
				default_count = _data_obj.view_count(is_submsges);

			if (default_count > counters_arr[0]) default_count = counters_arr[0];

			if (showed_count === counters_arr[0]) return;

			if (is_first_load) return {
				to_load_count: default_count,
				start_count: 0
			};

			is_first_load = showed_count < 1;

			var start_id = tree_obj.start_id(is_submsges),
				stop_id = tree_obj.stop_id(is_submsges),
				last_showed_id = stop_id,
				already_loaded_count = counters_arr[1] - showed_count,
				append_count = counters_arr[0] - showed_count,
				default_append_count = is_first_load ? default_count : _data_obj.view_count(),
				that_showed_count;

			append_count = append_count > default_count ? default_count : append_count;
			append_count = append_count > default_append_count ? default_append_count : append_count;

			if (showed_count < default_count) append_count = default_count - showed_count;

			already_loaded_count = already_loaded_count > append_count ? append_count : already_loaded_count;

			if (already_loaded_count > 0) {
				showed_count = tree_obj.showed(is_subs_mode, is_submsges, already_loaded_count, true);

				if (!loaded_count) {
					last_showed_id = _show_subs(false, [start_id, showed_count], mode_id, tree_obj.subs(is_submsges));
				}

				tree_obj.last_showed(is_submsges, showed_count);
				tree_obj.last_showed_id(is_subs_mode, is_submsges, last_showed_id);

				// if (!is_main_subs || is_view_subs !== "gallery_uno") {
					// _set_sub_subs_info(parent_el_id, [!is_submsges, is_submsges], [showed_count, showed_count]);
				// }
				_set_sub_subs_info(parent_el_id, [!is_submsges, is_submsges], [showed_count, showed_count]);

				that_showed_count = Math.abs(tree_obj.showed(!is_subs_mode, is_submsges));

				if (that_showed_count < default_count) {
					tree_obj.showed(!is_subs_mode, is_submsges, showed_count * (that_showed_count < 1 ? -1 : 1));
					tree_obj.last_showed_id(!is_subs_mode, is_submsges, last_showed_id);
				}
			}

			append_count = append_count - already_loaded_count;

			if (append_count > 0) return {
				to_load_count: append_count,
				start_count: showed_count,
				from_el_id: tree_obj.subs(is_submsges)[tree_obj.stop_id(is_submsges)].el_id()
			};
		},
		/* _append_page_iiiiiiiiiiiiii2 = function (page_obj, append_count, ids_params) {
			page_obj.is_changed(false, true);

			my_alert("_append_page_2");

			if (ids_params[0] > 0) page_obj.start_id(ids_params[0]);

			page_obj.is_middle(ids_params[2] > 0, true);

			page_obj.middle_id(ids_params[2] > 0, ids_params[ids_params[2] > 0 ? 2 : 1]);

			if (ids_params[3] > 0) page_obj.stop_id(ids_params[3]);

			// my_alert([param_obj["page_obj"].stop_id(), param_obj["page_obj"].stop_id() < 1]);

			page_obj.loaded(append_count);
			page_obj.start_count(append_count);

			// param_obj["page_obj"].is_changed(true);

			// my_alert(import_result[2]);
		}, */

		_toggle_page = function (is_submsges, page_obj, from_idyyy, start_subs_counyyyyyyt) {
			page_obj = page_obj || _get_page(is_submsges, 1);

			if (!page_obj) return;

			var paging_els = page_obj.paging_els(),
				$ul_el = paging_els["ul"][1],
				is_hidden = paging_els["ul"][0];

			if (is_hidden) _show_page(is_submsges, page_obj);

			$ul_el.css("height", is_hidden ? "" : $ul_el.height()).css("visibility", is_hidden ? "visible" : "hidden");

			paging_els["ul"][0] = !is_hidden;

			return $ul_el;
		},
		_show_page = function (is_submsgeiijis, page_obj) {
			var is_submsges = page_obj.is_submsges(),
				this_mode = page_obj.this_mode(),
				// pages_data = page_obj.pages_data(),
				// paging_els = page_obj.paging_els(),
				is_main_mode = dsk_mode.is_main_mode(this_mode);

			if (!is_main_mode) _toggle_page_subs(this_mode, is_submsges);

			var to_show_range = page_obj.show_range(true),
				is_subs_mode = this_mode === "subs";

			_checker_obj.show_checked(is_submsges);

			if (is_main_mode || to_show_range[1]) _set_bar(page_obj);

			if (to_show_range[1]) _show_subs(to_show_range[1], to_show_range[0], is_subs_mode, page_obj.subs_tree().subs(is_submsges), is_submsges);

			_checker_obj.checkeds_info(is_submsges);

			page_obj.is_last_showed(true);
			page_obj.is_current(true);
		},
		_show_subs = function (showed_range, to_show_range, is_subs_mode, subs_tree, is_submsges_section, checkeds_data) {
			var last_showed_id, to_show_count,
				i_msg, i_el_id, i_is_show, i_subs_type_id, i_to_show_count, // i_last_submsg,i_subs_tree, i_sub_tree_obj, , i_checked
				i_showed_range, i_to_show_range, i_last_to_show_count, i_start_ids,
				i_submsges,
				subs_counter, toggling_arr = [], i_is_subs_redraw = [], i_tree_obj,
				i_toggle, i_stop_id, $toggle_group;

			if (showed_range) {
				i_msg = showed_range[0];
				i_stop_id = showed_range[2];
			}

			while (i_msg >= i_stop_id) {
				i_tree_obj = subs_tree[i_msg];

				err_if(!i_tree_obj, "_show_subs_1: " + (i_msg || (i_msg === 0 ? "0" : showed_range)));

				toggling_arr[i_msg] = 0;

				i_msg = i_tree_obj.next_id();
			}

			i_msg = to_show_range[0];
			i_stop_id = to_show_range[2] || 0;
			to_show_count = i_stop_id > 0 ? -1 : to_show_range[1];

			checkeds_data = checkeds_data || _checker_obj.checked_subs(is_submsges_section);

			while (i_msg >= i_stop_id) {
				i_tree_obj = subs_tree[i_msg];

				err_if(!i_tree_obj, "_show_subs_2: " + [i_msg, i_stop_id, subs_counter]);

				toggling_arr[i_msg] = toggling_arr[i_msg] === 0 ? -1 : 1;

				i_el_id = i_tree_obj.el_id();

				//////////////////
				if (toggling_arr[i_msg] < 0 && !_msges_els[i_el_id][0]) toggling_arr[i_msg] = 1;
				//////////////////

				_checker_obj.show_checked(i_el_id, is_submsges_section, checkeds_data);
				// if (checkeds_data[2][i_el_id]) {
					// checkeds_data[0] = checkeds_data[0] + 1;
					// checkeds_data[7][i_el_id] = true;

					// if (checkeds_data[3][i_el_id]) {
						// checkeds_data[4][i_el_id] = true;
						// checkeds_data[5] = checkeds_data[5] + 1;
					// }
				// }

				last_showed_id = i_msg;

				i_msg = i_tree_obj.next_id();

				/////
				to_show_count -= 1;
				if (Math.abs(to_show_count) === 0) {
					to_show_range[2] = last_showed_id;
					break;
				}
			}

			for (i_toggle = 0; i_toggle < 2; i_toggle++) {
				i_is_show = i_toggle > 0;

				i_msg = !i_is_show ? showed_range[0] : to_show_range[0];
				i_stop_id = !i_is_show ? showed_range[2] : to_show_range[2];

				$toggle_group = $();

				while (i_msg >= i_stop_id) {
					i_tree_obj = subs_tree[i_msg];

					err_if(!i_tree_obj, "_show_subs_3: " + [i_msg, i_toggle]);

					i_el_id = i_tree_obj.el_id();

					if (i_is_show) {
						for (i_subs_type_id = 0; i_subs_type_id < 2; i_subs_type_id++) {
							i_submsges = i_subs_type_id > 0;

							i_to_show_count = i_tree_obj.showed(is_subs_mode, i_submsges);

							if (Math.abs(i_to_show_count) < 1) continue;

							i_start_ids = [i_tree_obj.start_id(i_submsges)];

							i_last_to_show_count = i_tree_obj.last_showed(i_submsges);

							// i_showed_range = [i_start_ids[0], 0, Math.abs(i_last_to_show_count)];
							// i_to_show_range = [i_start_ids[0], 0, Math.abs(i_to_show_count)];
							i_showed_range = [i_start_ids[0], 0, i_tree_obj.last_showed_id(!is_subs_mode, i_submsges)];
							i_to_show_range = [i_start_ids[0], 0, i_tree_obj.last_showed_id(is_subs_mode, i_submsges)];

							i_tree_obj.last_showed(i_submsges, i_to_show_count);

							_show_subs(i_showed_range, i_to_show_range, is_subs_mode, i_tree_obj.subs(i_submsges), is_submsges_section, checkeds_data);

							if (i_to_show_count > 0) {
								if (i_last_to_show_count < 1) $(css_obj.id("ul_id_") + i_el_id + (i_subs_type_id < 1 ? "" : "_submsges")).show();
							} else if (i_last_to_show_count > 0) $(css_obj.id("ul_id_") + i_el_id + (i_subs_type_id < 1 ? "" : "_submsges")).hide();

							i_is_subs_redraw[i_subs_type_id] = i_to_show_count !== i_last_to_show_count;
						}

						if (i_is_subs_redraw.length > 0) _set_sub_subs_info(i_el_id, i_is_subs_redraw, i_tree_obj.showed(is_subs_mode), i_tree_obj.loaded(is_subs_mode));

					}

					if (toggling_arr[i_msg] < 0) {
						i_msg = i_tree_obj.next_id();

						continue;
					}

					i_msg = i_tree_obj.next_id();

					if (_msges_els[i_el_id][0] === i_is_show) continue;

					$toggle_group = $toggle_group.add(_msges_els[i_el_id][1]);

					_msges_els[i_el_id][0] = i_is_show;
				}

				if (i_is_show) $toggle_group.show(); // $toggle_group.fadeIn();
				else $toggle_group.hide();
			}

			return last_showed_id;
		},

		_set_subs_buttons = function (this_mode, is_submsges) {
			this_mode = _paging_mode(this_mode);

			var is_both = this_mode !== "msg" && this_mode !== "subs",
				inter_modes_data = _paging_mode_data(this_mode, "inter_modes_data"),
				subs_count_arr = _data_obj.subs_count(this_mode),
				i_is_submsges_id, i_paging_els, i_$button_el, i_subs_count;

			if (!inter_modes_data) return;

			for (i_is_submsges_id = (is_both || !is_submsges ? 0 : 1); i_is_submsges_id < (is_both || is_submsges ? 2 : 1); i_is_submsges_id++) {
				i_paging_els = inter_modes_data[i_is_submsges_id] ? inter_modes_data[i_is_submsges_id]["paging_els"] : false;

				if (!i_paging_els && !is_both) return;
				if (!i_paging_els) continue;

				// err_if(!i_paging_els[this_mode !== "subs" ? "toggle_subs" : "toggle_subs_2"], "_set_subs_buttons: " + this_mode);

				// i_$button_el = i_paging_els[this_mode !== "subs" ? "toggle_subs" : "toggle_subs_2"][1];
				i_$button_el = i_paging_els["toggle_subs"][1];

				i_subs_count = subs_count_arr[is_both ? 0 : i_is_submsges_id];
				i_$button_el.toggle(i_subs_count > 0).children(css_obj.csd("subs_btn_2")).text("(" + i_subs_count + ")");

				if (!is_both) return;

				i_subs_count = subs_count_arr[1];
				i_$button_el.next("a").toggle(i_subs_count > 0).children("span").text("(" + i_subs_count + ")");
			}
		},

		_set_bar = function (page_obj) {
			var pages_data = page_obj.pages_data(),
				is_submsges = pages_data[1],
				subs_type_id = is_submsges ? 1 : 0,
				page_number = page_obj.page_number(),
				bar_els = page_obj.paging_els(), // _bar_els()[subs_type_id],
				showed_els = bar_els["showed_els"], // = bar_els["showed_els"] || [[], []], //_set_bar.showed_els = _set_bar.showed_els || [[], []],
				to_show_els = [],
				last_page_number = pages_data[2], // _page_data(is_submsges, "last")[3],
				// pages_len = last_page_number, page_data.length,
				is_mean = [],
				pages_wnd = [page_number - 1, page_number + 1],
				side_pages = [1 - 0, last_page_number - 0];

			// bar_els["toggle_subs"][1].toggle(pages_data[0] !== "subs");
			// bar_els["toggle_subs"][0] = pages_data[0] !== "subs";

			showed_els = showed_els[subs_type_id];

			if (last_page_number > 1 && !bar_els["bar"][0]) bar_els["bar"][1].show();

			for (var i_page = 0, i_is_mean, i_is_left, i_is_last, i_is_side, i_page_number; i_page < last_page_number; i_page++) {
				i_page_number = i_page + 1;

				i_is_last = i_page_number === last_page_number;
				i_is_left = i_page_number < pages_wnd[0];
				i_is_side = i_page_number <= side_pages[0] || i_page_number >= side_pages[1];
				i_is_mean = !i_is_side && (i_is_left || i_page_number > pages_wnd[1]);

				if (i_is_mean) {
					if (is_mean["mean_" + (i_is_left ? "0" : "1")]) my_alert("err 2121212");

					i_page = (i_is_left ? pages_wnd[0] - 1 : last_page_number - 1) - 1;
					is_mean["mean_" + (i_is_left ? "0" : "1")] = true;
					continue;
				}

				to_show_els.push(i_page);

				if (page_number === i_page_number) {
					_toggle_page_el(is_submsges, "prev", page_number < 2, bar_els);
				}
			}

			for (var i_on_page = 0, i_onned_page, i_is_show; i_on_page < to_show_els.length; i_on_page++) {
				i_is_show = true;
				for (i_onned_page = 0; i_onned_page < showed_els.length; i_onned_page++) {
					if (showed_els[i_onned_page] !== to_show_els[i_on_page]) continue;
					delete showed_els[i_onned_page];
					i_is_show = false;
					break;
				}
				if (i_is_show) _toggle_numeric_page(subs_type_id, to_show_els[i_on_page], bar_els);
				bar_els[to_show_els[i_on_page]][1].toggleClass(css_obj.css("current_page"), page_number === to_show_els[i_on_page] + 1);
			}

			for (var i_off_page = 0; i_off_page < showed_els.length; i_off_page++) {
				if (showed_els[i_off_page] > -1) {
					_toggle_page_el(is_submsges, showed_els[i_off_page], false, bar_els);
					continue;
				}
			}

			for (var i_mean_id = 0; i_mean_id < 2; i_mean_id++) {
				if (is_mean["mean_" + i_mean_id]) {
					if (i_mean_id === 0) bar_els[side_pages[i_mean_id] - 1][1].after(bar_els["mean_" + i_mean_id][1]);
					else bar_els[side_pages[i_mean_id] - 1][1].before(bar_els["mean_" + i_mean_id][1]);

					bar_els["mean_" + i_mean_id][1].show();
				} else _toggle_page_el(is_submsges, "mean_" + i_mean_id, false, bar_els);
			}

			_toggle_page_el(is_submsges, "next", page_obj.is_last(), bar_els);

			if (last_page_number < 2) bar_els["bar"][1].hide();

			bar_els["bar"][0] = last_page_number > 1;

			// _set_bar.showed_els[subs_type_id] = to_show_els;
			bar_els["showed_els"][subs_type_id] = to_show_els;

			_set_more_info(subs_type_id, page_obj);

		},

		_find_to_load = function (this_mode, mode_name, is_submsges_section, parents_arr, parent_el_id) {
			var to_move_count = !parents_arr ? 0 : parents_arr[0];
				// result_arr = [
					// [],
					// [[], []],
					// [],
					// to_move_count,
					// [[], []]
				// ];

			if (to_move_count < 1) return;

			err_if(is_null(is_submsges_section), "_find_to_load: is_submsges_section === undefined");

			var page_obj = _get_page(is_submsges_section, 1, mode_name);

			if (!page_obj) return to_move_count;

			var is_main_parent = !(parent_el_id > 1),
				tree_obj = _data_obj.subs_tree_obj(mode_name),
				change_info = [this_mode, 0, 0, 0, 0, 0],
				parent_tree_obj = _data_obj.subs_tree_obj(is_main_parent ? (this_mode === "new_msg" ? "subs" : this_mode) : parent_el_id),
				is_first_load = parent_tree_obj.loaded(),
				subs_tree = this_mode === "new_msg" || !is_main_parent ? false : parent_tree_obj.subs(is_submsges_section),
				// subs_tree = this_mode === "new_msg" || !is_main_parent ? false : _data_obj.subs_tree_obj(this_mode).subs(is_submsges_section),
				prev_change_info = tree_obj.subs_to_change(is_submsges_section, 0),
				i_el_id, i_id, i_subs_arr, i_sub_data, i_is_submsges, i_push_data, i_sub_number, i_before_sub_number; //, i_change_arr;

			break_test([parents_arr, subs_tree], "_find_to_load: [parents_arr, subs_tree]");

			for (i_id = 0; i_id < to_move_count; i_id++) {
				i_el_id = parents_arr[1][i_id];
				i_push_data = parents_arr.push_id(i_el_id);
				i_is_submsges = is_main_parent ? is_submsges_section : i_push_data[1];
				i_sub_number = i_push_data[2];
				i_before_sub_number = this_mode === "new_msg" ? -1 : _find_place(i_is_submsges, i_sub_number, is_main_parent ? mode_name : parent_el_id);

				if (!i_before_sub_number) continue;

				i_sub_data = !subs_tree ? { msg_id: i_push_data[3]} : subs_tree[i_sub_number].data();

				if (is_main_parent) {
					change_info[i_before_sub_number === -2 ? 2 : 1] += 1;

					tree_obj.subs_to_change(is_submsges_section, i_sub_number, [true, [i_before_sub_number, i_sub_data["msg_id"]]]);
				} else {
					i_subs_arr = tree_obj.subs_to_change(is_submsges_section, -1);
					i_push_data = i_subs_arr.push_id(parent_el_id) || i_subs_arr.push_id(parent_el_id, [[], [], [], [], 0, 0]);

					if (is_first_load[i_is_submsges ? 1 : 0] < 1) i_before_sub_number = -2;

					change_info[i_before_sub_number === -2 ? 5 : 4] += 1;

					if (i_before_sub_number === -2) {
						i_push_data[i_is_submsges ? 5 : 4] += 1;
					} else {
						i_before_sub_number = i_before_sub_number > 0 ? i_before_sub_number : 0;

						i_push_data[i_is_submsges ? 3 : 2].push(i_sub_data["msg_id"]);

						i_push_data = i_push_data[i_is_submsges ? 1 : 0].push_id(i_before_sub_number) || i_push_data[i_is_submsges ? 1 : 0].push_id(i_before_sub_number, []);
						i_push_data.push(i_sub_data["msg_id"]);
					}
				}
			}

			if (!change_info[1] && !change_info[2] && !change_info[4] && !change_info[5]) return to_move_count;

			if (!prev_change_info) tree_obj.subs_to_change(is_submsges_section, 0, change_info);
			else {
				prev_change_info[1] += change_info[1];
				prev_change_info[2] += change_info[2];
				prev_change_info[4] += change_info[4];

				err_if(prev_change_info[0] !== change_info[0], "_find_to_load: " + change_info[0] + "-" + prev_change_info[0]);
			}

			return to_move_count;
		},
		_find_place = function (is_submsges, sub_id, mode_name) {
			var parent_el_id = mode_name > 1 ? mode_name : 0,
				is_main_parent = parent_el_id === 0;

			if (is_main_parent) mode_name = _paging_mode(mode_name);

			var paging_data = is_main_parent ? _paging_data(mode_name)[is_submsges ? 1 : 0] : false,
				tree_obj = is_main_parent ? paging_data[0][7] : _data_obj.msg_data(parent_el_id)["subs_tree"],
				start_id = tree_obj.start_id(is_submsges);

			if (sub_id > start_id) return -1;

			var stop_id = tree_obj.stop_id(is_submsges),
				middle_id_arr = is_main_parent ? paging_data[0][5]["middle_ids"] : [];

			if (stop_id > 0 && stop_id > sub_id) my_alert.force(middle_id_arr[1] > 0 ? "ok after empty middle & not empty last!" : "ok after full!");
			if (stop_id > 0 && stop_id > sub_id) return middle_id_arr[1] > 0 ? stop_id : -2;

			if (sub_id < middle_id_arr[0] && sub_id > (middle_id_arr[1] || 0)) return my_alert("ok in empty middle & empty last!");

			if (sub_id < middle_id_arr[1]) start_id = middle_id_arr[1];

			_find_place.find_func = _find_place.find_func || function (i_el_id, i_sub_data) {
				if (i_sub_data["sub_number"] > _find_place.find_func.param_val) _find_place.find_func.result_val = i_sub_data["sub_number"];
				else return true;
			};

			_find_place.find_func.param_val = sub_id;

			_data_obj.iterate_subs_tree(mode_name, true, _find_place.find_func, is_submsges, start_id);

			return _find_place.find_func.result_val;
		},
		_find_parents_to_change = function (el, this_mode, mode_name, parents_to_change, move_result) {
			var parents_arr = [],
				is_main_mode = mode_name === "msg" || mode_name === "subs", // i_parent_arr, i_parent_stop_id,
				i_parent_type_id, i_parent_el_id, i_id, i_clone, i_msg_id, i_subs_count, i_parent_data,
				i_subs_type_id, i_subs_arr, i_clones_arr, i_childs_arr, i_is_submsges_section, i_sub_number;

			for (i_parent_type_id = 0; i_parent_type_id < 2; i_parent_type_id++) {
			for (i_msg_id in parents_to_change[i_parent_type_id]) if (parents_to_change[i_parent_type_id].hasOwnProperty(i_msg_id)) {
			for (i_subs_type_id = 0, i_parent_data = false; i_subs_type_id < 2; i_subs_type_id++) {
				i_childs_arr = parents_to_change[i_parent_type_id][i_msg_id][i_subs_type_id];
				i_subs_count = i_childs_arr.length;
				if (i_subs_count > 0 && move_result[1][i_parent_type_id][i_msg_id] && move_result[1][i_parent_type_id][i_msg_id][i_subs_type_id] > 0) i_subs_count = i_subs_count - move_result[1][i_parent_type_id][i_msg_id][i_subs_type_id];
				if (i_subs_count > 0) {
					i_parent_data = _data_obj.find_el_id(i_parent_type_id > 0, [["msg_id", i_msg_id]], is_main_mode ? mode_name : false);
					// i_parent_data = i_parent_data || _data_obj.find_el_id(i_parent_type_id > 0, [["msg_id", i_msg_id]], is_main_mode ? mode_name : false);
					if (i_parent_data) {
						i_parent_el_id = i_parent_data[0];

						if (is_main_mode) {	// to load not loaded
							i_clones_arr = _data_obj.get_clones_arr(i_parent_el_id) || [];
							i_clones_arr.push(i_parent_el_id);

							for (i_clone = 0; i_clone < i_clones_arr.length; i_clone++) {
								i_parent_el_id = i_clones_arr[i_clone];
								i_parent_data = _data_obj.msg_data(i_parent_el_id);

								i_subs_arr = parents_arr.push_id(i_parent_el_id) || parents_arr.push_id(i_parent_el_id, [[]]);

								i_is_submsges_section = i_parent_el_id > 0 ? i_parent_data["is_submsges_section"] : i_subs_type_id > 0;
								i_subs_arr[i_subs_type_id] = [i_subs_count, i_is_submsges_section, []];
								// i_parent_stop_id = i_parent_data[1]["subs_tree"].stop_id();

								for (i_id = 0; i_id < i_subs_count; i_id++) {
									i_sub_number = i_childs_arr[i_id][0];
									i_subs_arr[i_subs_type_id][2].push_id(i_sub_number, [0, i_subs_type_id > 0, i_sub_number, i_childs_arr[i_id][1]]);
								}

								_find_to_load(this_mode, mode_name, i_is_submsges_section, i_subs_arr[i_subs_type_id][2], i_parent_el_id);
							}
						} else { // to remove not loaded
							i_subs_arr = parents_arr.push_id(i_parent_el_id) || parents_arr.push_id(i_parent_el_id, [[]]);

							for (i_id = 0; i_id < i_subs_count; i_id++) i_subs_arr[0].push_id(i_id, [i_subs_type_id > 0]);
							if (i_parent_el_id < 1) {
								if (!i_subs_arr[1]) i_subs_arr[1] = [];
								i_subs_arr[1][i_subs_type_id] = true;
							}
						}
					}
				}
			}}}

			// break_test.force([parents_to_change, parents_arr], "_parents_to_change: [parents_to_change, parents_arr]");

			return parents_arr;

			// if (mode_name === "trash") return parents_arr;

			// if (mode_name === "trash") return _remove_subs(parents_arr, mode_name, move_result[0])[0];
			// return parents_arr;
		},

		_toggle_page_el = function (is_submsges, page_id, is_show, bar_els) {
			var page_el_arr = bar_els[page_id]; // _bar_els()[is_submsges ? 1 : 0][page_id];

			if (!page_el_arr) return [];

			if (page_id > -1 || page_id === "mean_0" || page_id === "mean_1") {
				if (is_show) page_el_arr[1].show();
				else page_el_arr[1].hide();
			} else if (is_show !== page_el_arr[0]) page_el_arr[1].toggleClass(css_obj.css("str_disable"), is_show);

			page_el_arr[0] = is_show;

			return page_el_arr;
		},
		_toggle_numeric_page = function (subs_type_id, page_id, bar_els1) {
			var bar_els = bar_els1, // _bar_els()[subs_type_id],
				page_els = bar_els1["numeric_els"],
				page_number = page_id + 1;

			if (!bar_els[page_id]) {
				// bar_els[page_id] = [false, $("<a class='page_el' onclick='MSG_OBJ.subs_set_page(this," + subs_type_id + "," + page_number + ")'>" + page_number + "</a>")];

				bar_els[page_id] = [false, $(document.createElement('a'))];
				bar_els[page_id][1].text(page_number).attr({
					'class': css_obj.css("page_el"),
					'onclick': "MSG_OBJ.mev_msg_subs_set_page_evm(this," + subs_type_id + "," + page_number + ")"
				});

				// bar_els[page_id][1].disableTextSelect();

				MSG_UTILS.sort_numeric_arr(page_els[1]);

				for (var i_id = 0, i_arr_count = page_els[1].length; i_id < i_arr_count; i_id++) {
					if (page_els[1][i_id] < page_number) continue;
					break;
				}

				bar_els[page_els[1][i_id - 1] - 1][1].after(bar_els[page_id][1]);
			}

			if (!page_els[0][page_id]) {
				page_els[0][page_id] = true;
				page_els[1].push(page_number);
			}

			return _toggle_page_el(subs_type_id > 0, page_id, true, bar_els1)[1];
		},

		_toggle_page_subs = function (this_mode, is_submsges, is_not_toggle) {
			this_mode = _paging_mode(this_mode);

			var inter_modes_data = _paging_mode_data(this_mode, "inter_modes_data"),
				is_submsges_id = is_submsges ? 1 : 0,
				is_edit_locked = !_data_obj.is_not_locked(0, true),
				paging_els = inter_modes_data[is_submsges_id]["paging_els"],
				subs_div_el = paging_els["subs_div"];

			if (this_mode !== "msg" && this_mode !== "subs") {
				subs_div_el[0] = true;
				subs_div_el[1].show();

				is_submsges_id = is_submsges ? 0 : 1;

				if (inter_modes_data[is_submsges_id]) {
					subs_div_el = inter_modes_data[is_submsges_id]["paging_els"]["subs_div"];
					subs_div_el[0] = false;
					subs_div_el[1].hide();
				}

				return;
			}

			if (!_toggle_page_subs.is_fold_arr) _toggle_page_subs.is_fold_arr = [[], []];

			var is_fold_arr = _toggle_page_subs.is_fold_arr[this_mode === "msg" ? 0 : 1],
				another_is_submsges_id = is_submsges ? 0 : 1,
				is_fold = false,
				is_full_fold = false,
				is_toggle = true,
				is_toggle_both_el = this_mode === "msg",
				msg_data = _data_obj.msg_data(),
				page_obj, is_values, label_str;

			if (this_mode === "msg") {
				is_values = msg_data["is_values"];

				is_toggle = _els_obj.view_count(is_submsges, "msg") > 0 && _data_obj.subs_count("msg", is_submsges) > 0;
				is_toggle_both_el = msg_data["msg_type"] !== "foto" && is_toggle && _els_obj.view_count(!is_submsges, "msg") > 0 && _data_obj.subs_count("msg", !is_submsges) > 0;
			}

			_els_obj.toggle_el("msg_tools_div", is_toggle_both_el);
			_els_obj.toggle_el("msg_" + is_submsges_id, is_toggle);

			if (!is_toggle) return;

			page_obj = _get_page(is_submsges, 1, this_mode);

			if (page_obj) {
				is_fold = is_not_toggle ? !!is_fold_arr[is_submsges_id] : !is_fold_arr[is_submsges_id];
			} else is_fold = is_values["is_fold_subs"][is_submsges_id];

			is_fold_arr[is_submsges_id] = is_fold;

			if (this_mode === "msg" && is_toggle_both_el) {
				is_full_fold = is_fold && is_fold_arr[another_is_submsges_id];
				_els_obj.el("msg_tools_label")[1].text(_els_labels[is_full_fold ? 3 : 2] + _els_labels[5]);

				if (is_full_fold) {
					_els_obj.toggle_el("msg_" + is_submsges_id, false);
					return _els_obj.toggle_el("msg_" + another_is_submsges_id, false);
				}
			}

			var not_str = css_obj.csd("sub_answ_div_hide") + "," + css_obj.csd("sub_answ_div_hide_2") + "," + css_obj.id("img_loading");
			paging_els["subs_tls"].children(":not(" + not_str + ")").toggle(!is_fold);
			not_str = css_obj.csd("paging_el") + "," + css_obj.id("img_loading");
			subs_div_el[1].children(":not(" + not_str + ")").toggle(!is_fold);

			if (is_edit_locked) $(css_obj.id("checkeds_info_") + is_submsges_id).hide();
			// if (paging_els["ul"][0]) {
				// paging_els["ul"][0] = false;
				// paging_els["ul"][1].show();
			// }


			paging_els.toggle("bar", !is_fold && page_obj && !page_obj.is_last());
			// if (is_fold && paging_els["bar"][0]) {
				// paging_els["bar"][0] = false;
				// paging_els["bar"][1].hide();
			// } else if (!is_fold && page_obj && !paging_els["bar"][0] && !page_obj.is_last()) {
				// paging_els["bar"][0] = !page_obj.is_last();
				// paging_els["bar"][1].toggle(!page_obj.is_last());
			// }

			paging_els["toggle_subs"][1].toggle(msg_data["msg_type"] !== "foto" || this_mode !== "msg" || is_submsges);

			if (msg_data["msg_type"] === "foto") {

				if (!is_submsges) {
					paging_els["toggle_foto"][1].toggle(this_mode === "msg");
					if (this_mode === "msg") return;
				}
			}

			if (this_mode === "msg") label_str = _els_labels[is_fold ? 3 : 2] + _els_labels[is_submsges_id];
			else label_str = _els_labels[is_submsges ? 10 : 9];

			paging_els["toggle_subs"][1].children(css_obj.csd("subs_btn_1")).text(label_str);
		},
		/* _toggle_page_subs2 = function (page_obj, is_not_toggle) {
			var this_mode = page_obj.this_mode(),
				is_main_mode = _is_main_mode(this_mode),
				is_submsges = page_obj.is_submsges(),
				inter_modes_data = _paging_mode_data(this_mode, "inter_modes_data"),
				paging_els = inter_modes_data[is_submsges ? 1 : 0]["paging_els"],
				another_paging_els = inter_modes_data[is_submsges ? 0 : 1]["paging_els"],
				// paging_els = page_obj.paging_els(),
				// another_paging_els = page_obj.inter_modes_data(!is_submsges, "paging_els"),
				another_page_obj, subs_btn_txt;

			if (is_main_mode) {
				var is_fold = this_mode === "msg" && page_obj.is_fold(!is_not_toggle),
					subs_div_el = paging_els["subs_div"],
					is_folded = !subs_div_el[0],
					subs_btn_txt;

				if (is_fold !== is_folded) {
					subs_div_el[0] = !is_fold;
					subs_div_el[1].children(":not(.sub_answ_div_hide,.sub_answ_div_hide_2,img_loading)").toggle(!is_fold);
				}

				if (this_mode === "msg") {
					subs_btn_txt = _els_labels[is_fold ? 3 : 2] + _els_labels[is_submsges ? 1 : 0];
				} else subs_btn_txt = _els_labels[is_submsges ? 10 : 9];

				paging_els["toggle_subs"][1].children(css_obj.csd("subs_btn_1")).text(subs_btn_txt);

				return; // _toggle_subs(0, is_submsges, this_mode, false, false, true);
			}


			// another_page_obj = _get_page(!is_submsges, 1, this_mode);
			// if (another_page_obj) another_page_obj.paging_els()["subs_div"][1].hide();
			if (another_paging_els) another_paging_els["subs_div"][1].hide();

			paging_els["subs_div"][1].show();
		}, */

		_toggle_subs = function (parent_el_id, is_submsges, this_mode, is_redraw, is_recursive, is_not_toggle, is_toggle) { //, is_fold) {
			// if (is_recursive) return _toggle_subs_recursive(parent_el_id, is_submsges, this_mode);

			this_mode = _paging_mode(this_mode);

			if (parent_el_id === 0) return _toggle_page_subs(this_mode, is_submsges); // _get_page(is_submsges, 1, this_mode));

			var subs_type_id = is_submsges ? 1 : 0,
				sub_data = _data_obj.msg_data(parent_el_id),
				is_main_subs = sub_data["parent_el_id"] < 1,
				is_view_subs = sub_data["view_type"]; // _data_obj.is_values("is_view_subs")[sub_data["is_msg"] ? 1 : 0];

			if (!parent_el_id) {
				if (is_view_subs !== "gallery") return;
				if (_toggle_subs.last_arr) _toggle_subs(_toggle_subs.last_arr[0], _toggle_subs.last_arr[1], this_mode);
				return _toggle_subs;
			}

			var is_subs_mode = this_mode !== "msg",
				// tree_obj = _data_obj.msg_data(parent_el_id, "subs_tree"),
				// sub_data = _data_obj.msg_data(parent_el_id), // opened_subs_arr,, showed_range, to_show_range
				tree_obj = sub_data["subs_tree"],
				$subs_ul_el = $(css_obj.id("ul_id_") + parent_el_id + (subs_type_id === 0 ? "" : "_submsges")),
				is_subs_redraw = [],
				subs_showed = [],
				showed_count;

			// if (is_redraw) {
				// my_alert("_toggle_sub_subs is_redraw");

				// start_ids = start_ids[subs_type_id] || [0];
				// showed_count = subs_tree[1][mode_id][subs_type_id];

				// showed_range = [start_ids[0], subs_tree[1][2][subs_type_id]];
				// to_show_range = [start_ids[0], Math.abs(showed_count)];

				// _show_subs(showed_range, to_show_range, mode_id, tree_obj.subs(subs_type_id > 0));
			// }

			showed_count = tree_obj.showed(is_subs_mode, subs_type_id > 0) * -1;

			if (is_toggle === true || is_toggle === false) {
				if ((showed_count > 0 && !is_toggle) || (!(showed_count > 0) && is_toggle)) return;
			}

			if (is_main_subs && is_view_subs === "gallery") {
				if (showed_count > 0) {
					if (_toggle_subs.last_arr) _toggle_subs(_toggle_subs.last_arr[0], _toggle_subs.last_arr[1], this_mode);
					_toggle_subs.last_arr = [parent_el_id, is_submsges];
				} else delete _toggle_subs.last_arr;
			}

			tree_obj.showed(is_subs_mode, is_submsges, showed_count);
			tree_obj.last_showed(is_submsges, showed_count);

			is_subs_redraw[subs_type_id] = true;
			subs_showed[subs_type_id] = showed_count;

			if (!is_main_subs || is_view_subs !== "gallery_uno") {
				_set_sub_subs_info(parent_el_id, is_subs_redraw, subs_showed);
			} else {
				alert("_toggle_subs gallery_uno?");
				// _toggle_subs(parent_el_id, !is_submsges, this_mode);
				// $(css_obj.id("ul_id_") + parent_el_id + (is_submsges ? "" : "_submsges")).hide();
			}

			if (is_redraw) $subs_ul_el.toggle(showed_count > 0);
			else $subs_ul_el.fadeToggle(showed_count > 0);
		},
		/* _toggle_subs_recursive = function (parent_el_id, mode_id, is_submsges) {
			var tree_obj = _data_obj.msg_data(parent_el_id, "subs_tree"),
				subs_tree = tree_obj.subs(is_submsges),
				subs_counter = parent_el_id === 0 ? _page_data(is_submsges)[1] : tree_obj.showed(mode_id > 0, is_submsges),
				i_msg = parent_el_id === 0 ? _page_data(is_submsges)[0] : tree_obj.start_id(),
				i_subs_type_id,	i_tree_obj, i_el_id;

			while (subs_counter > 0) {
				i_tree_obj = subs_tree[i_msg];

				alert_if(!i_tree_obj, "Err! _toggle_subs_recursive ", i_msg);

				if (i_tree_obj.is_removed()) continue;

				for (i_subs_type_id = 0; i_subs_type_id < 2; i_subs_type_id++) {
					if (i_tree_obj.showed(mode_id > 0, i_subs_type_id > 0) < 1) continue;

					i_el_id = i_tree_obj.el_id();

					_toggle_subs_recursive(i_el_id, mode_id, i_subs_type_id > 0);
					_toggle_subs(i_el_id, i_subs_type_id, mode_id);
				}

				i_msg = i_msg + 1;
				subs_counter = subs_counter - 1;
			}
		}, */

		_insert_new_subs = function (is_submsges, result_html, mode_name, import_result) {
			mode_name = mode_name || dsk_mode();

			var this_mode = dsk_mode(),
				page_obj = _get_page(is_submsges, 1, mode_name),
				is_init = !page_obj,
				// import_result = _place_result_html(mode_name, is_submsges, result_html, {
					// is_new_subs: true,
					// from_arr: [[-1]],
					// change_arr: [[-1]]
				// }),
				subs_count = import_result[0]; // 1

			if (is_init) {

			alert("_insert_new_subs INIT");
				_init_paging(mode_name, is_submsges);
				// page_obj = _paging_obj.get_page(is_submsges, 1, mode_name);
				return is_busy();
			}

			// my_alert.force("_insert_new_subs: subs_count=" + subs_count);

			_place_subs(mode_name, is_submsges, import_result[4]);

			page_obj.start_id();
			page_obj.subs_count(subs_count);
			page_obj.loaded(subs_count);
			page_obj.start_count(subs_count);
			page_obj.counter(page_obj.counter() + subs_count, true);

			page_obj.is_changed(false, true);

			if (mode_name === "msg" && this_mode === mode_name) {
				_toggle_page(is_submsges, page_obj);
				_toggle_page_subs("msg", is_submsges, true);
			}

			page_obj.show_range(true);

			_els_obj.set_top_menu(mode_name);

			_set_subs_buttons(mode_name, is_submsges);
		},
		_insert_new_sub_subs = function (is_submsges, result_html, parent_el_id, is_first_load) {
			var is_subs_mode = dsk_mode() !== "msg",
				mode_id = is_subs_mode ? 1 : 0,
				sub_data = _data_obj.msg_data(parent_el_id),
				parent_tree_obj = sub_data["subs_tree"],
				is_closed = parent_tree_obj.showed(is_subs_mode, is_submsges) < 0,
				showed_count = parent_tree_obj.showed(is_subs_mode, is_submsges, 1, true);

			parent_tree_obj.last_showed(is_submsges, showed_count);
			parent_tree_obj.showed(!is_subs_mode, is_submsges, 1, true);

			if (is_closed) _toggle_subs(parent_el_id, mode_id, 0, true);
			else if (is_first_load) _set_sub_subs_info(parent_el_id, [true], [1]);
		},
		_place_subs = function (parent_el_id, is_submsges, place_arr) {
			err_if(MSG_UTILS.is_int(place_arr) || !place_arr[0] || !place_arr[1], "_place_subs_0: " + place_arr);

			if (!_place_subs.sort_func) _place_subs.sort_func = function (a_val, b_val) { return b_val - a_val;};

			var from_arr = place_arr[0],
				subs_arr = place_arr[1],
				is_main_parent = !(parent_el_id > 1),
				mode_name = parent_el_id > 1 ? false : parent_el_id,
				page_obj = is_main_parent ? _get_page(is_submsges, 1, mode_name) : false,
				parent_tree_obj = _data_obj.tree_obj(parent_el_id),
				parent_subs_tree = parent_tree_obj.subs(is_submsges),
				from_arr_len,
				msges_els = _els_obj.form_els["msges_els"],
				$subs_ul_el = mode_name ? _paging_els(mode_name, is_submsges)["ul"][1] : $(css_obj.id("ul_id_") + parent_el_id + (is_submsges ? "_submsges" : "")),
				$i_from_el, i_from_id, i_from_tree_obj, i_from_sub_number,
				i_sub_id, i_sub_number, i_subs_arr_len, i_subs_arr, i_is_new_subs, i_from_el_id;

			for (i_from_id = 0, from_arr_len = from_arr.length; i_from_id < from_arr_len; i_from_id++) {
				i_from_sub_number = from_arr[i_from_id];

				if (i_from_sub_number === -2) continue;

				i_is_new_subs = i_from_sub_number === -1;

				i_subs_arr = subs_arr[i_from_sub_number].sort(_place_subs.sort_func);

				i_from_sub_number = i_is_new_subs ? i_subs_arr[0] : i_from_sub_number;
				i_from_tree_obj = parent_subs_tree[i_from_sub_number];

				err_if(!i_from_tree_obj, "_place_subs_1 " + [i_from_sub_number, i_subs_arr[0], i_from_id]);

				i_from_el_id = i_from_tree_obj.el_id();
				$i_from_el = msges_els[i_from_el_id][1];

				if (i_is_new_subs) $subs_ul_el.prepend($i_from_el);

				for (i_sub_id = i_is_new_subs ? 1 : 0, i_subs_arr_len = i_subs_arr.length; i_sub_id < i_subs_arr_len; i_sub_id++) {
					i_sub_number = i_subs_arr[i_sub_id];
					i_from_sub_number = i_subs_arr[i_sub_id];
					i_from_tree_obj = parent_subs_tree[i_from_sub_number];

					err_if(!i_from_tree_obj, "_place_subs " + [i_from_sub_number, i_sub_id]);

					i_from_el_id = i_from_tree_obj.el_id();
					$i_from_el = msges_els[i_from_el_id][1].insertAfter($i_from_el);

					/* if (page_obj && !page_obj.is_in_show_range(i_sub_number)) {
						alert("_place_subs: i_sub_number=" + i_sub_number);

						msges_els[i_from_el_id][0] = false;
						msges_els[i_from_el_id][1].hide();
					}	 */
				}
			}
		},

		_remove_subs = function (parents_arr, mode_name, more_load_arr) {
			mode_name = _paging_mode(mode_name);
			more_load_arr = more_load_arr || [];

			var foreign_parents_arr = [[], []],
				main_subs_arr = [[], [], 0, 0],
				// count_favs = _data_obj.msg_data(0, "count_subs")[4],i_is_submsges,
				// to_load_arr, i_current_page_number, i_page_number, i_page_obj, i_pages_count, i_is_inter_pages,
				i_id, i_sub_data, i_parent, i_el_id, i_sub_id, i_subs_type_id, i_parent_tree_obj, i_parent_el_id, i_counter_arr,
				i_move_arr, i_parent_data, i_is_main_parent,
				i_is_submsges_section, i_is_msg, i_is_out_foreign, i_out_foreigns_counter_arr;

			for (i_parent = 0; i_parent < parents_arr[0]; i_parent++) {
				i_parent_el_id = parents_arr[1][i_parent];
				i_is_main_parent = i_parent_el_id < 1;
				i_parent_data = _data_obj.msg_data(i_parent_el_id);
				i_move_arr = parents_arr.push_id(i_parent_el_id);

				i_parent_tree_obj = i_is_main_parent ? _data_obj.subs_tree_obj(mode_name) : i_parent_data["subs_tree"];

				i_counter_arr = [0, 0, 0, 0];

				// debug_arr([parents_arr, i_move_arr], "l", true);

				for (i_id = 0, i_move_arr = i_move_arr[0]; i_id < i_move_arr[0]; i_id++) {
					i_el_id = i_move_arr[1][i_id];

					i_sub_data = i_move_arr.push_id(i_el_id);
					i_is_submsges_section = i_sub_data[0];
					i_is_msg = i_sub_data[1];
					i_subs_type_id = i_is_msg ? 1 : 0;
					i_sub_id = i_sub_data[2];
					i_is_out_foreign = i_sub_data[3];

					if (i_is_out_foreign) {
						i_out_foreigns_counter_arr = foreign_parents_arr[i_parent_data["is_msg"] ? 1 : 0][i_parent_data["msg_id"]];
						if (!i_out_foreigns_counter_arr) i_out_foreigns_counter_arr = foreign_parents_arr[i_parent_data["is_msg"] ? 1 : 0][i_parent_data["msg_id"]] = [0, 0];
						i_out_foreigns_counter_arr[i_subs_type_id] = i_out_foreigns_counter_arr[i_subs_type_id] + 1;
					}

					i_counter_arr[i_subs_type_id] = i_counter_arr[i_subs_type_id] + 1;

					if (i_sub_id > 0) {
						if (i_is_main_parent) {
							if (!i_is_out_foreign) main_subs_arr[i_subs_type_id].push(i_sub_id);
							else {
								var current_page_number = _get_page_number(i_is_msg),
									page_number = _get_page_number(i_is_msg, i_sub_id);

								if (current_page_number === page_number) main_subs_arr[i_subs_type_id].push(i_sub_id);
								else {
									i_parent_tree_obj.remove_sub(i_is_msg, i_sub_id);
									main_subs_arr[i_subs_type_id + 2] = main_subs_arr[i_subs_type_id + 2] + 1;
								}
							}
						} else i_parent_tree_obj.remove_sub(i_is_msg, i_sub_id);

						i_counter_arr[i_subs_type_id + 2] = i_counter_arr[i_subs_type_id + 2] + 1;

						_els_obj.sub_el(i_el_id, false, true);
					} else if (i_is_main_parent) main_subs_arr[i_subs_type_id + 2] = main_subs_arr[i_subs_type_id + 2] + 1;
				}

				for (i_subs_type_id = 0; i_subs_type_id < 2; i_subs_type_id++) {
					if (i_counter_arr[i_subs_type_id] < 1) continue;

					if (i_is_main_parent) _remove_main_subs(i_subs_type_id, main_subs_arr, mode_name, more_load_arr);
					else _remove_sub_subs(i_subs_type_id, i_parent_el_id, i_counter_arr, mode_name);
				}

				if (i_is_main_parent) {
					if (i_counter_arr[0] > 0) _set_subs_buttons(mode_name, false);
					if (i_counter_arr[1] > 0) _set_subs_buttons(mode_name, true);
				} else if (i_counter_arr[0] > 0 || i_counter_arr[1] > 0) {
					_set_sub_subs_info(i_parent_el_id, [i_counter_arr[0] > 0, i_counter_arr[1] > 0], i_parent_tree_obj.loaded());
				}
			}

			return [more_load_arr[0] > 0 ? more_load_arr : false, foreign_parents_arr];
		},
		_remove_main_subs = function (subs_type_id, main_subs_arr, mode_name, more_load_arr) {
			var this_mode = _paging_mode(),
				is_submsges = subs_type_id > 0,
				page_obj = _get_page(is_submsges, (this_mode !== mode_name ? 1 : false), mode_name),
				parent_tree_obj = page_obj.tree_obj(),
				subs_arr = main_subs_arr[subs_type_id],
				move_count = subs_arr.length,
				// loaded_count = parent_tree_obj.loaded(is_submsges, move_count * -1),
				showed_count = page_obj.subs_count() - move_count,
				// mode_id = mode_name === "msg" ? 0 : 1,
				default_count = _els_obj.view_count(is_submsges, mode_name), // mode_id === 0 ? _defaults["count_main_page_subs"] : _defaults["count_subs_page"],
				subs_count, to_load_arr;

			parent_tree_obj.loaded(is_submsges, move_count * -1);

			page_obj.is_changed(false, true);

			if (showed_count < 1) {
				err_if(page_obj.subs_count() !== move_count, "_remove_main_subs 1");

				page_obj = _remove_page(page_obj);

				if (!page_obj) {
					my_alert.force("_remove_main_subs: no_subs, move_count=" + move_count);

					to_load_arr = more_load_arr.push_id(0) || more_load_arr.push_id(0, []);

					to_load_arr[subs_type_id] = [0, 0];
					// to_load_arr[subs_type_id] = [1, false, true];	// ????!!!!

					return more_load_arr;
				}
			}

			if (showed_count > 0) {
				var page_range = [
						page_obj.start_id(),
						page_obj.stop_id(),
						page_obj.middle_id(),
						page_obj.middle_id(true)
					],
					i_sub, i_sub_id, i_neighbours_ids;

				for (i_sub = 0; i_sub < move_count; i_sub++) {
					i_sub_id = subs_arr[i_sub];

					if (i_sub_id > 0) {
						i_neighbours_ids = parent_tree_obj.remove_sub(is_submsges, i_sub_id);

						if (i_sub_id === page_range[0]) page_range[0] = i_neighbours_ids[1];
						if (i_sub_id === page_range[1]) page_range[1] = i_neighbours_ids[0];
						if (i_sub_id === page_range[2]) page_range[2] = i_neighbours_ids[0];
						if (i_sub_id === page_range[3]) page_range[3] = i_neighbours_ids[1];
					}
				}

				page_obj.start_id(page_range[0]);
				page_obj.stop_id(page_range[1]);
				page_obj.middle_id(false, page_range[2]);
				page_obj.middle_id(true, page_range[3]);

				page_obj.loaded(move_count * -1);
				page_obj.start_count(move_count * -1);
				page_obj.subs_count(move_count * -1);

				page_obj.show_range(true);

				if (page_obj.is_last()) default_count = showed_count;

				subs_count = parent_tree_obj.count(is_submsges, move_count * -1);

				page_obj.counter(page_obj.counter() - move_count, true);
			}

			err_if(subs_count < 1, "_remove_main_subs: no_subs? should be subs");

			subs_count = default_count - showed_count;

			if (subs_count > 0) {
				to_load_arr = more_load_arr.push_id(0) || more_load_arr.push_id(0, []);

				err_if(to_load_arr[subs_type_id] > 0, "_remove_main_subs: to_load_arr > 0 " + [subs_type_id, to_load_arr[subs_type_id]]);

				to_load_arr[subs_type_id] = [subs_count, showed_count > 0 ? false : page_obj.page_number()];
			}

			// if (showed_count > 0) page_obj.counter(page_obj.counter() - move_count, true);

			if (main_subs_arr[subs_type_id + 2] > 0) {
				page_obj.is_changed(true, true);
				parent_tree_obj.count(is_submsges, main_subs_arr[subs_type_id + 2] * -1);

				to_load_arr = more_load_arr.push_id(0) || more_load_arr.push_id(0, []);
				to_load_arr[subs_type_id] = [1, false, true];
			}
		},
		_remove_page = function (page_obj) { // , remove_count) {
			var this_mode = page_obj.this_mode(),
				page_number = page_obj.page_number(),
				remove_count = page_obj.subs_count(),
				pages_data = page_obj.pages_data(true),
				is_submsges = pages_data[0][1],
				tree_obj = page_obj.subs_tree(),
				subs_tree = tree_obj.subs(is_submsges),
				// is_submsges_id = is_submsges ? 1 : 0,temp_page,
				last_page_number = pages_data[0][2],
				middle_pages = pages_data[0][6],
				prev_middle_pages = [middle_pages[0], middle_pages[1]],
				i_page, i_page_obj;

			my_alert("_remove_page: page_number=" + page_number);

			for (var i_sub = 0, i_sub_id = page_obj.start_id(), i_neighbours_ids, i_tree_obj; i_sub < remove_count; i_sub++) {
				i_tree_obj = subs_tree[i_sub_id];

				alert_if(!i_tree_obj, "err_1! _remove_page", i_sub_id);

				i_neighbours_ids = tree_obj.remove_sub(is_submsges, i_sub_id);
				// i_neighbours_ids = _data_obj.remove_sub(tree_obj, is_submsges, i_sub_id);

				i_sub_id = i_neighbours_ids[1];
			}

			tree_obj.count(is_submsges, remove_count * -1);

			for (i_page = page_number; i_page < last_page_number; i_page++) {
				if (i_page === middle_pages[0]) {
					if (page_number === i_page) {
						i_page_obj = pages_data[i_page] = _get_page(is_submsges, page_number + 1);	// current_mode?

						i_page_obj.page_number(i_page);
						i_page_obj.counter(i_page_obj.counter() - remove_count);
					} else {
						delete pages_data[i_page];
						middle_pages[0] = middle_pages[0] - 1;
					}

					i_page = middle_pages[1] = middle_pages[1] - 1;
				}

				i_page_obj = pages_data[i_page] = pages_data[i_page + 1];

				alert_if(!i_page_obj, "err_2! _remove_page", i_page);

				i_page_obj.page_number(i_page);
				i_page_obj.counter(i_page_obj.counter() - remove_count);
			}

			if (page_number === last_page_number) {
				if (page_number === 1) {
					my_alert("info: cleared _paging_data");

					_paging_data(this_mode, is_submsges, true);

					// if (this_mode === "msg" || this_mode === "subs") {
						// _paging_data("msg")[is_submsges_id] = [];
						// _paging_data("subs")[is_submsges_id] = [];
					// } else _paging_data(this_mode)[is_submsges_id] = [];

					return;
				}

				page_number = last_page_number - 1;
				pages_data[page_number] = _get_page(is_submsges, page_number); // current_mode?

				if (!(pages_data[page_number].stop_id() > 0)) tree_obj.stop_id(is_submsges, false);

				pages_data[page_number].middle_id(true, pages_data[page_number].start_id());
			} else if (page_number > 1 && pages_data[page_number - 1]) { // ??? TEST !!!!
				page_number = page_number - 1;
			}

			if (page_number === prev_middle_pages[1]) {
				pages_data[middle_pages[1]].middle_id(true, pages_data[middle_pages[1]].start_id());
			}

			page_obj.subs_count(remove_count * -1);
			page_obj.show_range(false);

			delete pages_data[last_page_number];

			pages_data[last_page_number - 1].is_last(true);

			return pages_data[page_number];
		},
		_remove_sub_subs = function (subs_type_id, parent_el_id, counter_arr, mode_name, more_load_arr) {
			var mode_id = mode_name === "msg" ? 0 : 1,
				is_subs_mode = mode_id > 0,
				is_submsges = subs_type_id > 0,
				move_count = counter_arr[subs_type_id],
				// moved_count = counter_arr[subs_type_id + 2],
				parent_data = _data_obj.msg_data(parent_el_id),
				is_submsges_section = parent_data["is_submsges_section"],
				parent_tree_obj = parent_data["subs_tree"],
				// loaded_count = parent_tree_obj.loaded(is_submsges, moved_count * -1),
				showed_count = parent_tree_obj.showed(is_subs_mode, is_submsges),
				subs_count = parent_tree_obj.count(is_submsges, move_count * -1),
				default_count = _els_obj.view_count(is_submsges); // _defaults["count_sub_subs"];

			parent_tree_obj.last_showed(is_submsges, showed_count);

			err_if(subs_count < 1 || showed_count < 1, "NOT ERR! _remove_sub_subs: subs_count < 1 || showed_count < 1 " + [subs_count, showed_count]);

			if (subs_count < 1) return;

			subs_count = default_count - showed_count;

			if (subs_count > 0) {
				if (!more_load_arr) return;

				var to_load_arr = more_load_arr.push_id(parent_el_id) || more_load_arr.push_id(parent_el_id, []);

				err_if(to_load_arr[subs_type_id] > 0, "_remove_sub_subs: to_load_arr > 0 " + [parent_el_id, subs_type_id, to_load_arr[subs_type_id]]);

				to_load_arr[subs_type_id] = [subs_count, is_submsges_section];

				return;
			}

			subs_count = default_count - Math.abs(parent_tree_obj.showed(!is_subs_mode, is_submsges));

			if (subs_count > 0) {
				parent_tree_obj.last_showed_id(!is_subs_mode, is_submsges, false, subs_count);
				parent_tree_obj.showed(!is_subs_mode, is_submsges, subs_count, true);
			}
		},

		_set_more_info = function (subs_type_id, page_obj) {
			var $more_info_el = page_obj.paging_els()["more_info"][1], //_bar_els()[subs_type_id]["more_info"][1],
				more_count = page_obj.subs_tree().count(subs_type_id > 0) - page_obj.counter();
				//more_count = _msg_all_subs[subs_type_id] - page_obj.counter();

			$more_info_el.css("visibility", more_count > 0 ? "visible" : "hidden");

			page_obj.paging_els()["more_info"][0] = more_count > 0;
			//_bar_els()[subs_type_id]["more_info"][0] = more_count > 0;

			if (more_count < 1) return;

			_set_more_info.label_str = _set_more_info.label_str || $more_info_el.text();

			$more_info_el.text(_set_more_info.label_str + "(+" + more_count + ")");
		},
		_set_sub_subs_info = function (el_id, is_redraw, subs_showed, subs_loadedyyyy) {
			var msg_data = _data_obj.msg_data(el_id),
				is_msg = msg_data["is_msg"],
				is_main_subs = msg_data["parent_el_id"] < 1,
				is_gallery_uno = is_main_subs && _data_obj.is_values("is_view_subs")[is_msg ? 1 : 0] === "gallery_uno",
				tree_obj = msg_data["subs_tree"],
				count_arr = [tree_obj.count(false), is_msg ? tree_obj.count(true) : 0],
				els_labels = _els_obj.form_els.els_labels,
				i_subs_type_id, i_hide_label, i_more_label, i_showed_count, i_count_all,
				i_count_more, i_$el;

			for (i_subs_type_id = 0; i_subs_type_id < 2; i_subs_type_id++) {
				if (!is_redraw[i_subs_type_id]) continue;

				i_count_all = tree_obj.count(i_subs_type_id > 0);

				// if (is_gallery_uno) {
					// i_$el = $(css_obj.id("glr_uno_tls_") + el_id);
					// if (i_subs_type_id > 0) i_$el.children(css_obj.csd("sub_answ_div_hide_2")).toggle(i_count_all > 0);
					// else i_$el.children(css_obj.csd("sub_answ_div_hide")).toggle(i_count_all > 0);
				// }

				i_$el = $(css_obj.id("sub_info_") + i_subs_type_id + "_" + el_id + (is_gallery_uno ? "_more" : ""));

				if (i_count_all < 1) { i_$el.hide(); continue;}

				i_showed_count = subs_showed[i_subs_type_id] > 0 ? subs_showed[i_subs_type_id] : 0;
				i_count_more = i_count_all - i_showed_count;

				i_more_label = i_showed_count > 0 && i_count_more > 0 ? els_labels[4] + els_labels[i_subs_type_id] + "(" + i_count_more + ")" : "";

				if (!is_gallery_uno) {
					i_hide_label = i_showed_count > 0 ? els_labels[2] + els_labels[i_subs_type_id] : els_labels[3] + els_labels[i_subs_type_id] + "(" + i_count_all + ")";
					i_$el.text(i_hide_label).next("span").text(i_more_label);
				} else i_$el.text(i_more_label);
			}
		};

	return {
		init_obj: function () {
			return _init_obj(this);
		},
		show_page: _show_page,
		toggle_page: _toggle_page,
		toggle_subs: _toggle_subs,
		set_sub_subs_info: _set_sub_subs_info,
		// append_sub_subs: _append_sub_subs,
		// append_page: _append_page,
		append_subs: _append_subs,
		remove_subs: _remove_subs,
		// sub_to_change: _sub_to_change,
		place_subs: _place_subs,
		insert_new_subs: _insert_new_subs,
		insert_new_sub_subs: _insert_new_sub_subs,
		check_pages: _check_pages,
		paging_data: _paging_data,
		get_page: _get_page,
		get_page_number: _get_page_number,
		check_changes: _check_changes,
		init_paging: _init_paging,
		find_to_load: _find_to_load,
		find_parents_to_change: _find_parents_to_change,
		paging_mode: _paging_mode,
		paging_mode_data: _paging_mode_data,
		toggle_page_subs: _toggle_page_subs,
		set_subs_buttons: _set_subs_buttons,


	};
}());
