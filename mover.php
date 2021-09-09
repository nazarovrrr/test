<?php

class dsg_MOVER extends dsg_CLASS_BASE {
	public function __construct() {	
		
	}
	
	//////////////moving////////////
	public function move_pubs ($from_mode, $to_mode, $up_galo_is_dsg, $up_galo_id_key, $move_data, $edit_pin, $up_galo_id) {
		$is_favs = $from_mode === 'favs' || $to_mode === 'favs';		
		
		// $check_result = $this->check_dsg($up_galo_id_key, 'id_key', $edit_pin, array (							
			// 'is_edit_pin' => true,
			// 'fav_is_dsg' => false ////!!!!!?????????????
		// ));					
		
		// $up_galo_id = intval($check_result['ID']);
		// if (!($up_galo_id > 0) || $up_galo_is_dsg !== $check_result['is_dsg']) return 'err_up_galo_id';
		
		$move_arr = [[], []];		
		
		for ($i_galo_id = 0, $galos_count = count($move_data); $i_galo_id < $galos_count; $i_galo_id++) {
			$i_move_arr = explode(',', $move_data[$i_galo_id]);
			$i_move_count = count($i_move_arr);
			$i_galo_pub_type = intval($i_move_arr[0]);
			$i_galo_dsg_id = decode_id($i_move_arr[1]);				
			$i_pubs_count = array ( intval($i_move_arr[2]), intval($i_move_arr[3]));
			$is_main_galo = $i_galo_dsg_id === $up_galo_id;
			
			$i_is_to_load = $to_load_count > 0 && $is_main_galo;				
			
			$i_del_arr = [[], []];
			
			if ($is_favs && $is_main_galo) $favs_arr = [[], [], false, ''];
			
			for ($i_id = 4; $i_id < $i_move_count; $i_id++) {
				$i_pub_type = intval($i_move_arr[$i_id]);								
								
				$i_dsg_id = decode_id($i_move_arr[$i_id + 1]);				
				$i_pub_id = intval($i_move_arr[$i_id + 2]);				
				
				if ($i_dsg_id < 1 || $i_pub_id < 1) return 'err_pub_ids';
								
				$i_is_fav = intval($i_move_arr[$i_id + 3]) > 0 && $check_result['FAVS_0'][$i_dsg_id];				
				if ($i_is_fav) unset($check_result['FAVS_0'][$i_dsg_id]);
				
				$i_del_arr[$i_pub_type][] = array ($i_dsg_id, $i_pub_id);
				
				if ($is_favs && $is_main_galo) $favs_arr[$i_pub_type][] = $i_dsg_id;
				
				$i_id = $i_id + 3;			
			}									
			 
			$move_arr[$i_galo_pub_type][] = array ($i_galo_dsg_id, $i_del_arr);		 						
		}			
		
		if (!$move_arr || count($move_arr) < 1) return 'err_to_move_data_2';			
		
		if ($is_favs) {
			$favs_arr[2] = count($favs_arr[1]) > 0;
			$favs_arr[3] = implode(',', $favs_arr[$favs_arr[2] ? 1 : 0]);
		}
		
		$check_result = $this->checker_obj()->check_dsg($up_galo_id_key, 'id_key', $edit_pin, array (							
			'is_edit_pin' => true,
			'fav_id' => $is_favs ? $favs_arr[3] : false,
			'fav_is_dsg' => $is_favs && $favs_arr[2] // false ////!!!!!?????????????
		));					
		
		if ($up_galo_id !== $check_result['ID'] || $up_galo_is_dsg !== $check_result['is_dsg']) return 'err_up_galo_id';
							
		if ($is_favs) return $this->_toggle_favs($to_mode === 'favs', $up_galo_id, $up_galo_is_dsg, $favs_arr, $check_result['pubs_count']['favs']);
					
		$result_arr_obj = $this->_db_obj()->move_pubs($from_mode, $to_mode, $up_galo_id, $up_galo_is_dsg, $move_arr, $edit_pin);
		
		$galos_to_change = [];
		
		for ($i_pubs_type = 0; $i_pubs_type < 3; $i_pubs_type++) {
			$i_galos_arr = $result_arr_obj['own_childs_in_out_foreign_galos'][$i_pubs_type];
			$i_galos_count = count($i_galos_arr);
			
			if ($i_galos_count < 1) continue;
			
			$i_galos_type = $i_pubs_type > 0 ? 1 : 0;			
			
			if (!isset($galos_to_change[$i_galos_type])) $galos_to_change[$i_galos_type] = [];
			
			for ($i_galo_id = 0; $i_galo_id < $i_galos_count; $i_galo_id++) {
				$i_galo_dsg_id = dsg_KEYS::encode_id($i_galos_arr[$i_galo_id][0]);
				if (!isset($galos_to_change[$i_galos_type][$i_galo_dsg_id])) $galos_to_change[$i_galos_type][$i_galo_dsg_id] = [[], []];
							
				for ($i_child_id = 0, $i_child_count = count($i_galos_arr[$i_galo_id][1]); $i_child_id < $i_child_count; $i_child_id++) {
					$galos_to_change[$i_galos_type][$i_galo_dsg_id][$i_pubs_type === 1 ? 1 : 0][] = [
						intval($i_galos_arr[$i_galo_id][1][$i_child_id]),
						dsg_KEYS::encode_id(intval($i_galos_arr[$i_galo_id][2][$i_child_id]))
					];
				}
			}
		}
		
		$result_arr_obj['galos_to_change'] = json_encode($galos_to_change);
		
		$favs_arr = [];
		
		for ($i_pubs_type = 0; $i_pubs_type < 2; $i_pubs_type++) {		
			$i_favs_arr = $result_arr_obj['up_galo_favs'][$i_pubs_type];			
			if (!$i_favs_arr) continue;		
			
			// $i_favs_arr = explode(',', $i_favs_str);		
			
			for ($i_id = 0, $i_favs_count = count($i_favs_arr); $i_id < $i_favs_count; $i_id++) {
				$i_fav_dsg_id = dsg_KEYS::encode_id($i_favs_arr[$i_id]);
				if (!$favs_arr[$i_pubs_type]) $favs_arr[$i_pubs_type] = [];
				$favs_arr[$i_pubs_type][] = $i_fav_dsg_id;
			}
		}
		
		$result_arr_obj['up_galo_favs'] = json_encode($favs_arr);
			
		return $result_arr_obj;	
	}
	
	public function move_pubsyyyyyyyy2 ($action_name, $up_galo_id, $up_galo_is_dsg, $move_arr, $edit_pin) {
		if (!$move_arr || count($move_arr) < 1) return false;				
		
		return $this->_db_obj()->move_pubs($action_name, $up_galo_id, $up_galo_is_dsg, $move_arr, $edit_pin);	
	}
	//////////////favs////////////
	public function toggle_fav ($id_key, $fav_id_key, $edit_pin) {							
		$is_dsg = !is_answer($id_key);
		$fav_is_dsg = !is_answer($fav_id_key);
	
		$fav_check = $this->_db_obj()->check_dsg([
			'is_dsg' => $fav_is_dsg,
			'is_limited' => 0,
			'id' => $fav_is_dsg ? 0 : decode_answer_id($fav_id_key),
			'id_key' => $fav_is_dsg ? $fav_id_key : '',				
			'edit_pin' => '0',
			'fav_is_dsg' => $is_dsg
		]);				
		
		$fav_id = $fav_check['ID'];
		$galos_count = $fav_check['pubs_count']['faveds'][$is_dsg ? 1 : 0];
		
		$galo_check = $this->_db_obj()->check_dsg([
			'is_dsg' => $is_dsg,
			'is_limited' => 0,
			'id' => $is_dsg ? 0 : decode_answer_id($id_key),
			'id_key' => $is_dsg ? $id_key : '',				
			'edit_pin' => $edit_pin,
			'fav_is_dsg' => $fav_is_dsg,
			'fav_id' => $fav_id
		]);	
		
		$is_fav = !($galo_check['IS_FAV'] > 0);						
		
		// dsg_logger('toggle_fav: galo_check ' . pretty_json($galo_check));	
		
		if ($fav_check['IS_VALUES']['is_not_fav'] && $is_fav) return 'is_not_fav';	#not favable?	
		
		$galo_id = $galo_check['ID'];	
		$last_pub_id = $galo_check['LAST_FAV_pub_ID_' . ($fav_is_dsg ? 1 : 0)];
	
		return $this->_db_obj()->toggle_fav($is_dsg, $galo_id, $fav_is_dsg, $fav_id, $last_pub_id, $is_fav);		
	}
	private function _toggle_favs ($is_fav, $galo_id, $galo_is_dsg, $favs_arr, $favs_count_arr) {							
		$is_pubdsges = $favs_arr[2] === true;
		$favs_count = count($favs_arr[$is_pubdsges ? 1 : 0]);
					
		if (!$is_fav && ($favs_count < 1 || $favs_count_arr[$is_pubdsges ? 1 : 0] !== $favs_count)) return 'err_favs_0';
		else if ($is_fav && $favs_count_arr[$is_pubdsges ? 1 : 0] > 0) return 'err_favs_1';
			
		dsg_logger('_toggle_favs: favs_arr ' . pretty_json($favs_arr));
			
		// if ($fav_check['IS_VALUES']['is_not_fav'] && $is_fav) return 'is_not_fav';	#not favable?		
	
		return $this->_db_obj()->toggle_favs($galo_is_dsg, $galo_id, $is_pubdsges, $favs_count, $favs_arr[3], $is_fav);		
	}
	
}



?>