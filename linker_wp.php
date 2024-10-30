<?php
/*
Plugin Name: LDS Scripture Linker
Plugin URI: http://www.dearscriptures.com/linker_wp
Description: Converts scripture references to mouseover links that contain the scripture referenced. References all LDS Standard works and the King James Apocrypha
Version: 2.9.1
Author: Steven Lloyd
Author URI: http://www.dearscriptures.com
*/

//------------------ DO NOT MODIFY ANYTHING BELOW THIS LINE ------------------------------
function getPluginVersion(){return '2.9.1';}
//--------------- WordPress Functions ---
//register the javascript
wp_enqueue_script('linker_js', get_option('siteurl') . '/wp-content/plugins/lds-scripture-linker/scripts.js',null,null,true);

//register the style sheet
wp_enqueue_style('linker_css', get_option('siteurl') . '/wp-content/plugins/lds-scripture-linker/styles.css');
//replace scripture references in the post content
add_filter('the_content','scriptureLinker');
//replace references in comments
add_filter('comment_text','scriptureLinker');
//Add a Configuration option
add_action('admin_menu', 'addLDSOptionsMenu');
add_action('wp_footer','writeScriptureMetaData');

//------------------ FOR SURE, DO NOT MODIFY ANYTHING BELOW THIS LINE -------------------------------
function writeScriptureMetaData(){
	$ds_linker=wpldslink_get_options();
	//clear the cache once if this is newly installed
	$progpath=dirname(__FILE__);
	if(!file_exists("{$progpath}/clear.txt")){
		file_put_contents("{$progpath}/clear.txt", time());
		$ds_linker['clear_cache']=1;
    	}
	if($ds_linker['clear_cache']==1){
		//clear cache
		$alloptions = get_alloptions();
		foreach($alloptions as $name=>$val){
			if(preg_match('/^wpldslinkrefs\_/',$name)){
				delete_option($name);
            	}
        	}
        $ds_linker['clear_cache']=0;
        update_option('wpldslinksettings', $ds_linker);
		}
	//get scriptures for references
	if(!is_array($_POST['scripture_references'])){return true;}
	$references=array_keys($_POST['scripture_references']);
	if(!is_array($references)){return true;}
	$ref_count=count($references);
	if($ref_count==0){return true;}
	//Check for cached references
	$references=sortArrayByLength($references);
	$refs_name='wpldslinkrefs_' . md5(implode('',$references));
	//check the database for these
	$query='local';
	$scriptures=get_option($refs_name);
	if(!is_array($scriptures)){
		//References found  - Query DearScriptures API to get Scriptures
		$scriptures=getReferenceScriptures($references);
		add_option($refs_name,$scriptures);
		$query='remote';
		}
	if(!is_array($scriptures)){return true;}
	$scr_count=count($scriptures);
	$icon=get_option('siteurl') . '/wp-content/plugins/lds-scripture-linker/icon.png';
	$drag=get_option('siteurl') . '/wp-content/plugins/lds-scripture-linker/drag.gif';

	echo "\n";
    echo "<!-- Begin: LDS Scripture Linker Meta Data provided by DearScriptures.com {$query} query, {$ref_count} references,{$scr_count} scriptures -->\n";
    //google index?
    if(!isset($ds_linker['index_google']) || $ds_linker['index_google']!=1){echo '<!--googleoff: all-->'."\n";}
    //scriptures
    echo '<div id="lds_scripture_linker">'."\n";
    foreach($scriptures as $reference=>$scripture){
		$reference=trim($reference);
		$scripture=trim($scripture);
		$reference=str_ireplace('&','&amp;',$reference);
		$refid='dslink_'.abs(crc32($reference));
    	echo '<div id="'.$refid.'" reference="'.$reference.'" style="display:none;z-index:945">'."\n";
		echo '<div class="linker_roundbox" style="background-color:'.$ds_linker['background-color'].';';
		if(preg_match('/MSIE/i',$_SERVER['HTTP_USER_AGENT'])){
			echo 'border:1px outset '.$ds_linker['border-color'].';';
			}
		echo '">'."\n";
		echo '<div align="right" style="font-size:10pt;margin-right:5px;">';
		echo '<img src="'.$drag.'" title="Drag this window" id="'.$refid.'_drag" style="display:none;cursor:move;padding:2px 50px 0px 20px;" border="0">'."\n";
		if(!strlen($ds_linker['paid_key'])){
			echo '<a target="_ds" href="http://www.dearscriptures.com" style="color:#093a6b;text-decoration:none;"><img src="'.$icon.'" border="0" width="16" height="16" /> DearScriptures.com</a>';
			}
		echo '</div>'."\n";
		echo '<div style="';
		if(strlen($scripture) > 1000){echo 'height:200px;overflow:auto;';}
		echo 'font-size:11pt;font-weight:normal;padding:10px;margin-right:2px;">';
		echo $scripture;
		echo '</div>'."\n";
		echo '<div align="right" style="font-size:10pt;margin-right:5px;">';
		echo '<div class="linker_bottomNote" id="'.$refid.'_note"><strong> Click Scripture Reference To Keep Window Open.</strong></div>'."\n";
		echo '<a style="color:#093a6b;text-decoration:none;font-weight:bold;font-size:9pt;" href="#" onclick="linkHide(\''.$refid.'\');return false;">Close</a>';
		echo '</div>';
		echo '</div>';
		echo '</div>'."\n";
		echo "\n";
		}
    echo '</div>'."\n";
    //google index?
    if(!isset($ds_linker['index_google']) || $ds_linker['index_google']!=1){echo '<!--googleon: all-->'."\n";}
    echo "<!-- END: LDS Scripture Linker Meta Data provided by DearScriptures.com -->\n";
    return true;
	}
function addLDSOptionsMenu() {
	//add_options_page('WP-FLV, options page', 'WP-FLV', 9, basename(__FILE__), 'wpflv_options_page');
	add_options_page('LDS Scripture Linker Settings, options page', 'LDS Scripture Linker', 9, basename(__FILE__), 'showWpLDSLinkOptions');
    //add_submenu_page('options-general.php', 'LDS Scripture Linker Settings', 'LDS Scripture Linker Settings', 8, __FILE__, 'showWpLDSLinkOptions');
	}
//-----------------------
function buildDir($dir='',$mode=0777,$recursive=1){
	//info:recursive folder generator
	if(is_dir($dir)){return 0;}
	return mkdir($dir,$mode,$recursive);
	}
function showWpLDSLinkOptions(){
	if ($_POST['wpldslink']){
		update_option('wpldslinksettings', $_POST['wpldslink']);
		$message = '<div class="updated"><p><strong>Options saved.</strong></p></div>';
		}
	//get options
	$o = wpldslink_get_options();
	//set checked
	$decoration = ($o['decoration'] == 'underline') ? ' checked="checked"' : '';
	$index_google = ($o['index_google'] == 1) ? ' checked="checked"' : '';
	$reflinks=array(
		($o['reflinks'] == 0) ? ' checked="checked"' : '',
		($o['reflinks'] == 1) ? ' checked="checked"' : '',
		($o['reflinks'] == 2) ? ' checked="checked"' : ''
		);
	echo <<<EOT
		<div class="wrap">
			<h2>LDS Scripture Linker Settings</h2>
			{$message}
			<form name="form1" method="post" action="options-general.php?page=linker_wp.php">
			<fieldset class="options">
				<table width="100%" cellspacing="2" cellpadding="5" class="editform">
					<tr valign="top">
						<td width="33%" scope="row"><b>Hover Color</b> - Color for links that have references less than 1000 characters. These links will show the scripture reference popup when the mouse is over the link.</td>
						<td><input type="text" value="{$o['hover-color']}" name="wpldslink[hover-color]" size="10" /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Click Color</b> - Color for links that have references greater than 1000 characters. These links will show the scripture reference popup when the link is clicked.</td>
						<td><input type="text" value="{$o['click-color']}" name="wpldslink[click-color]" size="10" /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Border Color</b> - Border Color for popups. This is only used for users using Internet Explorer. Mozilla based browsers will show a faded rounded corner effect.</td>
						<td><input type="text" value="{$o['border-color']}" name="wpldslink[border-color]" size="10" /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Background Color</b> - Background Color for popups.</td>
						<td><input type="text" value="{$o['background-color']}" name="wpldslink[background-color]" size="10" /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Decoration</b> - Check to underline the links referenced?.</td>
						<td><input type="checkbox" value="underline" name="wpldslink[decoration]"{$decoration}  /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Index Google?</b> Uncheck to prevent google bots from indexing the scripture references as part of your page.</td>
						<td><input type="checkbox" value="1" name="wpldslink[index_google]"{$index_google}  /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Reference links?</b> Select where you want the scripture references inside the popup window to linked to. You will need to clear your reference cache for it to take effect on previously viewed pages.</td>
						<td>
							<label for="hl0"><input id="hl0" type="radio" value="0" name="wpldslink[reflinks]"{$reflinks[0]} /> No Link</label><br />
							<label for="hl1"><input id="hl1" type="radio" value="1" name="wpldslink[reflinks]"{$reflinks[1]} /> Link to http://scriptures.lds.org</label><br />
						</td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Clear Scripture Reference Cache?</b> Check to clear the cache the next time a page is viewed (not sticky).</td>
						<td><input type="checkbox" value="1" name="wpldslink[clear_cache]"  /></td>
					</tr>
					<tr valign="top">
						<td width="33%" scope="row"><b>Remove DearScriptures.com Links?</b><br>To remove references to dearscriptures.com in the popup window you need to donate $10 or more to our cause.  To donate go to http://www.dearscriptures.com and click on the donate link in the top right. Once you donation is received, you will be given a unique user and key.  Enter them here. </td>
						<td>
							<b>User:</b> <input type="text" value="{$o['paid_user']}" name="wpldslink[paid_user]" size="20" />
							<p>
							<b>Key:</b> <input type="text" value="{$o['paid_key']}" name="wpldslink[paid_key]" size="40" />
						</td>
					</tr>
				</table>
			</fieldset>
			<p class="submit">
				<input type="submit" name="Submit" value="Update Options &raquo;" />
			</p>
			</form>
		</div>
		<div align="right" style="margin-right:20px;">provided by <a target="_ds" style="color:#093a6b;text-decoration:none;" href="http://www.dearscriptures.com"><img alt="DearScriptures.com" src="http://www.dearscriptures.com/image/icon.png" border="0" /> DearScriptures.com</a></div>
EOT;
	}
function wpldslink_get_options(){
	//set defaults
	$defaults = array(
		'hover-color'		=> '#000000',
		'click-color'		=> '#87a0b9',
		'border-color'		=> '#093a6b',
		'background-color'	=> '#f0f2f5',
		'decoration'		=> 'underline',
		'index_google'		=> 1,
		'reflinks'			=> 0,
		'clear_cache'		=> 0,
		'lang'				=> 'en'
		);
	$options = get_option('wpldslinksettings');
	if(!is_array($options)){
		$options = $defaults;
		update_option('wpldslinksettings', $options);
		}
	return $options;
	}
function getReferenceScriptures($refs=array()){
	$ds_linker=wpldslink_get_options();
	$opts=array();
	for($i=0;$i<count($refs);$i++){
		$key='ref'.$i;
		$opts[$key]=$refs[$i];
    	}
    $url='http://stage.dearscriptures.com/wpapi';
    $opts['request']='scriptures';
    $opts['apikey']='d29KaEI2MURGNG9rSTpwbFpMcWQ1Ry5rL3BzOndvNUtNUm9FUzRHaG8=';
    $opts['username']='wordpress';
    if(strlen($ds_linker['paid_user']) && strlen($ds_linker['paid_key'])){
		$opts['username']=$ds_linker['paid_user'];
    	$opts['apikey']=$ds_linker['paid_key'];
		}
    $opts['lang']=$ds_linker['lang'];
    $opts['reflinks']=$ds_linker['reflinks'];
    $opts['skip_error']=true;
    $result = wpApiRequest($url,$opts);
    return $result['verses'];
	}
function sortArrayByLength($arr=array()){
	usort($arr,'sortByLength');
	return $arr;
	}
function sortByLength($a,$b){
	if($a == $b) return 0;
	return (strlen($a) > strlen($b) ? -1 : 1);
	}
function asciiEncode($str=''){
	$outstr='';
	for($i=0;$i<strlen($str);$i++){
		$char=$str[$i];
		$code=ord($char);
		//echo "char[{$char}],code[{$code}],outstr[{$outstr}]<br>\n";
		if(($code > 64 && $code < 91) || ($code > 96 && $code < 123)){
			$outstr .= '&#'.$code.';';
			}
		else{$outstr .= $str[$i];}
    	}
    return $outstr;
	}
//-----------------------
function encrypt($string='', $key='') {
	$result='';
	for($i=0; $i<strlen($string); $i++) {
		$char = substr($string, $i, 1);
		$keychar = substr($key, ($i % strlen($key))-1, 1);
		$char = chr(ord($char)+ord($keychar));
		$result.=$char;
		}
	return base64_encode($result);
	}
//-------------------
function removeCdata($xhtml=''){
	//$xhtml = preg_replace('(<\!\[CDATA\[(.|\n)*\]\]>)', '', $xhtml);
	$xhtml = str_replace(array('<![CDATA[',']]>') , '', $xhtml);
	return htmlspecialchars_decode($xhtml);
	}
//-----------------------
function wpApiRequest($url='',$opts=array()){
	//info: returns an array of scripture references
	$results=array('opts_in'=>$opts,'url_in'=>$url);
	//record server info so we can process the request correctly
	$sfields=array('remote_addr','request_uri','http_host','http_referrer','http_user_agent','script_uri');
	foreach($sfields as $sfield){
		$ufield=strtoupper($sfield);
		$opts[$sfield]=$_SERVER[$ufield];
		}
	$opts['wp_version']=getPluginVersion();
	$post=wpPostURL($url,$opts);
	$results['raw']=$post['body'];
	try {
		$results['xml'] = new SimpleXmlElement($results['raw']);
		}
	catch (Exception $e){
        $results['error'] = "parse error: " . $e->faultstring;
        }
    if(isset($results['xml'])){

		$results['verses']=array();
		foreach($results['xml']->verses->verse as $verse){
			$reference=utf8_decode(removeCdata((string)$verse->reference));
			$reference=trim($reference);
			$results['verses'][$reference]=utf8_decode(removeCdata((string)$verse->scripture));
        	}
        if(count($results['verses'])==0){unset($results['verses']);}
    	}
    if(!isset($opts['-debug'])){
    	unset($results['raw']);
    	unset($results['xml']);
    	unset($results['opts_in']);
    	unset($results['url_in']);
		}
	return $results;
	}
//--------------------
function wpPostURL($url,$params=array()) {
	$rtn=array('_params'=>$params);
	//Build data stream from params
	$query=array();
	foreach($params as $key=>$val){
		if(preg_match('/^\-/',$key)){continue;}
		$query[$key]=$val;
    	}
    if(count($query)){
		$postfields=http_build_query($query);
		$rtn['_postfields']=$postfields;
		}
	if(isset($params['-method']) && preg_match('/^GET$/i',$params['-method'])){
		if($postfields){$url .= '?'.$postfields;}
		$process = curl_init($url);
		curl_setopt($process, CURLOPT_POST, 0);
    	}
	else if(isset($params['-method']) && preg_match('/^DELETE$/i',$params['-method'])){
		//if($postfields){$url .= '?'.$postfields;}
		$process = curl_init($url);
		curl_setopt($process, CURLOPT_POST, 0);
		curl_setopt($process, CURLOPT_CUSTOMREQUEST,'DELETE');
    	}
	else if(isset($params['-method']) && preg_match('/^PUT$/i',$params['-method'])){
		//if($postfields){$url .= '?'.$postfields;}
		$process = curl_init($url);
		curl_setopt($process, CURLOPT_POST, 0);
		curl_setopt($process, CURLOPT_CUSTOMREQUEST,'PUT');
    	}
	else{
		$process = curl_init($url);
		curl_setopt($process, CURLOPT_POST, 1);
		if($postfields){
			curl_setopt($process, CURLOPT_POSTFIELDS, $postfields);
			}
		}
	curl_setopt($process, CURLOPT_FRESH_CONNECT, 1);
	if(!isset($params['-user_agent'])){
		$params['-user_agent'] = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0)';
		}
	if(!isset($params['-compression'])){
		$params['-compression'] = 'gzip';
		}
	if(isset($params['-headers']) && is_array($params['-headers'])){
		curl_setopt($process, CURLOPT_HTTPHEADER, $params['-headers']);
		}
	curl_setopt($process, CURLOPT_HEADER, 1);
	curl_setopt($process, CURLOPT_USERAGENT, $params['-user_agent']);
	if(isset($params['-ssl']) && $params['-ssl']==false){
		curl_setopt($process, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($process, CURLOPT_SSL_VERIFYHOST, FALSE);
		}
	curl_setopt($process, CURLINFO_HEADER_OUT, true);
	//if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEFILE, $this->cookie_file);
	//if ($this->cookies == TRUE) curl_setopt($process, CURLOPT_COOKIEJAR, $this->cookie_file);
	//curl_setopt($process, CURLOPT_ENCODING , $params['-compression']);
	curl_setopt($process, CURLOPT_TIMEOUT, 60);
	//if ($this->proxy) curl_setopt($cUrl, CURLOPT_PROXY, ?proxy_ip:proxy_port?);


	curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);
	//turn retrieving the header off
	//curl_setopt ($process, CURLOPT_HEADER, 0);
	//convert Unix newlines to CRLF newlines
	curl_setopt ($process, CURLOPT_CRLF, 0);
	$returndata = curl_exec($process);
	$rtn['header_out']=curl_getinfo($process,CURLINFO_HEADER_OUT);
	//check for errors
	if ( curl_errno($process) ) {
		$rtn['error_number'] = curl_errno($process);
		$rtn['error'] = curl_error($process);
		}
	else{
		//break it up into header and body
		$parts=preg_split('/\r\n\r\n/',trim($returndata),2);
		while(preg_match('/^HTTP\/1\./s',$parts[1])){
			$parts=preg_split('/\r\n\r\n/',trim($parts[1]),2);
        	}
		$rtn['header']=trim($parts[0]);
		$rtn['body']=trim($parts[1]);
		//parse the header into an array
		$parts=preg_split('/[\r\n]+/',trim($rtn['header']));
		foreach($parts as $part){
			if(!preg_match('/\:/',$part)){continue;}
			list($key,$val)=preg_split('/\:/',trim($part));
			$key=strtolower(trim($key));
			$rtn['headers'][$key]=trim($val);
        	}
    	}
	$rtn['url']=$url;
	if(!$params['skip_error'] && !isset($rtn['body']) && isset($rtn['error'])){
		echo "<h2>postURL Connection Error</h2><br>\n";
		echo "<b>Error #:</b> {$rtn['error_number']}<br>\n";
		echo "<b>Url:</b> {$rtn['url']}<br>\n";
		echo "<b>Error Message:</b> {$rtn['error']}<br>\n";
		echo "<b>Header Sent:</b><br>\n<pre>\n{$rtn['header_out']}\n</pre>\n";
		curl_close($process);
		exit;
        }
    //close the handle
	curl_close($process);
	return $rtn;
	}
function scriptureLinker($text=''){
	$ds_linker=wpldslink_get_options();
	//handle em dash and en dash
	// First, replace UTF-8 characters.
	$text = str_replace(
 		array("\xe2\x80\x98", "\xe2\x80\x99", "\xe2\x80\x9c", "\xe2\x80\x9d", "\xe2\x80\x93", "\xe2\x80\x94", "\xe2\x80\xa6"),
 		array("'", "'", '"', '"', '-', '--', '...'),
 		$text);
	// Next, replace their Windows-1252 equivalents.
 	$text = str_replace(
 		array(chr(145), chr(146), chr(147), chr(148), chr(150), chr(151), chr(133)),
 		array("'", "'", '"', '"', '-', '--', '...'),
 		$text);
	$text=str_replace('&#038;','&amp;',$text);
	$scriptureBooks=array(
		//Standard Works titles
		'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Solomon\'s Song','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation','1 Nephi','2 Nephi','Jacob','Enos','Jarom','Omni','Words of Mormon','Mosiah','Alma','Helaman','3 Nephi','4 Nephi','Mormon','Ether','Moroni','Doctrine and Covenants','Moses','Abraham','Joseph Smith--Matthew','Joseph Smith--History','Articles of Faith',
		//Apocrypha titles
		'The Rest of Esther','Azariah','Bel and the Dragon','Susanna','Tobit','Manasseh','2nd Maccabees','1st Maccabees','Judith','2nd Esdras','1st Esdras','Sirach','Baruch',
		//Standard Works Abbr
		'Gen.','Ex.','Lev.','Num.','Deut.','Josh.','Judg.','Ruth','1 Sam.','2 Sam.','1 Kgs.','2 Kgs.','1 Chr.','2 Chr.','Ezra','Neh.','Esth.','Job','Ps.','Prov.','Eccl.','Song.','Isa.','Jer.','Lam.','Ezek.','Dan.','Hosea','Joel','Amos','Obad.','Jonah','Micah','Nahum','Hab.','Zeph.','Hag.','Zech.','Mal.','Matt.','Mark','Luke','John','Acts','Rom.','1 Cor.','2 Cor.','Gal.','Eph.','Philip.','Col.','1 Thes.','2 Thes.','1 Tim.','2 Tim.','Titus','Philem.','Heb.','James','1 Pet.','2 Pet.','1 Jn.','2 Jn.','3 Jn.','Jude','Rev.','1 Ne.','2 Ne.','Jacob','Enos','Jarom','Omni','W of M','Mosiah','Alma','Hel.','3 Ne.','4 Ne.','Morm.','Ether','Moro.','D&amp;C','D&C','Moses','Abr.','JS-M','JS-H','A of F',
		//Standard Works Abbr2
		'Hos.','Am.','Jon.','Mic.','Nah.','Mt.','Mk.','Lk.','Jn.','Phil.','1 Thess.','2 Thess.','Jas.',
		//Standard Works idx
		'gen','ex','lev','num','deut','josh','judg','ruth','1_sam','2_sam','1_kgs','2_kgs','1_chr','2_chr','ezra','neh','esth','job','ps','prov','eccl','song','isa','jer','lam','ezek','dan','hosea','joel','amos','obad','jonah','micah','nahum','hab','zeph','hag','zech','mal','matt','mark','luke','john','acts','rom','1_cor','2_cor','gal','eph','philip','col','1_thes','2_thes','1_tim','2_tim','titus','philem','heb','james','1_pet','2_pet','1_jn','2_jn','3_jn','jude','rev','1_ne','2_ne','jacob','enos','jarom','omni','w_of_m','mosiah','alma','hel','3_ne','4_ne','morm','ether','moro','dc','moses','abr','js_m','js_h','a_of_f'
		);
	$found=array();
	$references=array();
	//$debug='';
	if(!is_array($POST['scripture_references'])){$POST['scripture_references']=array();}
	foreach($scriptureBooks as $book){
		//scripture referencee
		$book=(string)$book;
		unset($rmatch);
		//$book=str_replace('&','\\&',$book);
		$reg='/([>]*)'.$book.'\s+[0-9]+\:[0-9\:\-\,\s]+/is';
		if(preg_match_all($reg,$text,$rmatch)){
			$matchcnt=count($rmatch[0]);
			//$debug .= "{$book} - {$matchcnt} Matches<br>\n";
			for($m=0;$m<$matchcnt;$m++){
				//skip references that are already linked
				if(isset($rmatch[1][$m]) && $rmatch[1][$m]=='>'){
					$ref=trim(asciiEncode($rmatch[0][$m]));
					$text=str_ireplace($rmatch[0][$m],$ref,$text);
					continue;
					}
				$ref=$rmatch[0][$m];
				$references[]=$ref;
				$_POST['scripture_references'][$ref]+=1;
				}
        	}
        //book reference
        unset($rmatch);
		if(preg_match_all('/([>]*)'.$book.'\s+[0-9]+/is',$text,$rmatch)){
			$matchcnt=count($rmatch[0]);
			for($m=0;$m<$matchcnt;$m++){
				//skip references that are already linked
				if(isset($rmatch[1][$m]) && $rmatch[1][$m]=='>'){
					$ref=trim(asciiEncode($rmatch[0][$m]));
					$text=str_ireplace($rmatch[0][$m],$ref,$text);
					continue;
					}
				$ref=$rmatch[0][$m];
				$references[]=$ref;
				$_POST['scripture_references'][$ref]+=1;
				}
        	}
		}
	//sort references by longest first
	$references=sortArrayByLength($references);
	//replace references
	$hidden=array();
	foreach($references as $reference){
		//encrypt the reference
		$reference=trim($reference);
		$ref=encrypt($reference,4321234);
		//ascii encode the title so we do not see it again
		$title=str_ireplace('&amp;','&',$reference);
		$title=trim(asciiEncode($title));
		$refid='dslink_'.abs(crc32($reference));
		$sref=str_ireplace('&amp;','&',trim($reference));
		$link='<a style="padding:1px;color:'.$ds_linker['click-color'].';text-decoration:'.$ds_linker['decoration'].';" href="#" onclick="linkClick(\''.$refid.'\');return false;" onmouseover="linkMouseOver(\''.$refid.'\');" onmouseout="linkMouseOut(\''.$refid.'\');">'.$title.'</a>';
		$text=str_ireplace($reference,$link,$text);
    	}
	return $text;
	}
//--------------------
function printValue($v=''){
	$rtn='<pre type="'.gettype($v).'">'."\n";
	ob_start();;
	print_r($v);
	$rtn .= ob_get_contents();
	ob_end_clean();
	$rtn .= "\n</pre>\n";
	return $rtn;
	}
?>