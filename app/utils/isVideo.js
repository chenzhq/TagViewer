'use strict';

import path from 'path';

const videoExtensions = [
	'3g2',
	'3gp',
	'aaf',
	'asf',
	'avchd',
	'avi',
	'drc',
	'flv',
	'm2v',
	'm4p',
	'm4v',
	'mkv',
	'mng',
	'mov',
	'mp2',
	'mp4',
	'mpe',
	'mpeg',
	'mpg',
	'mpv',
	'mxf',
	'nsv',
	'ogg',
	'ogv',
	'qt',
	'rm',
	'rmvb',
	'roq',
	'svi',
	'vob',
	'webm',
	'wmv',
	'yuv'
]

const exts = Object.create(null);

videoExtensions.forEach(el => exts[el] = true);

export default function(fileName) {
  return path.extname(fileName).slice(1).toLowerCase() in exts;
}
