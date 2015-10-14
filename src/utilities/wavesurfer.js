/**
 * WaveSurfer
 * ==========
 *
 *
 */


/**
 * Configure the wavesurfer instance and keep it synced with the provided video.
 *
 * @param  {object} 		 wavesurfer -
 * @param  {HTMLElement} video      -
 */
export function setupWaveSurfer (wavesurfer, video) {

	createOverlays(wavesurfer)

	const { pre, select, post } = wavesurfer.regions.list

	select.on('update', () => {
		updateRegions(wavesurfer)
		if (video) {
			video.currentTime = select.start
			wavesurfer.play(select.start)
			wavesurfer.pause()
		}
	})

	pre.on('dblclick', getRegionClickHandler(pre, ::select.update, 'start'))
	select.on('dblclick', getRegionClickHandler(select, ::select.update))
	post.on('dblclick', getRegionClickHandler(post, ::select.update, 'end'))

	if (video) {
		wavesurfer.toggleMute()
		video.addEventListener('timeupdate', () => {
			wavesurfer.play(video.currentTime)
			if (video.paused) {
				setTimeout(::wavesurfer.pause, 16.7)
			}
		})
		video.addEventListener('pause', () => wavesurfer.pause())

		select.update({
			start: video.currentTime,
			end: wavesurfer.getDuration()
		})
		wavesurfer.play(video.currentTime)
		setTimeout(::wavesurfer.pause, 16.7)
	} else {
		select.update({
			start: 0,
			end: wavesurfer.getDuration()
		})
	}
}

/**
 * Initialize timeline and regions
 *
 * @param  {[type]} wavesurfer [description]
 * @return {[type]}            [description]
 */
function createOverlays (wavesurfer) {

	const timeline = Object.create(WaveSurfer.Timeline)
	timeline.init({
		wavesurfer: wavesurfer,
		container: '#timeline'
		// fontFamily: 'Courier'
	})

	wavesurfer.addRegion({
		id: 'pre',
		color: 'rgba(0,0,0,0.5)',
		drag: false,
		resize: false
	})

	wavesurfer.addRegion({
		id: 'select',
		drag: true,
		resize: true
	})

	wavesurfer.addRegion({
		id: 'post',
		color: 'rgba(0,0,0,0.5)',
		drag: false,
		resize: false
	})
}

/**
 * Synchronize changes with all regions
 *
 * @param  {object} wavesurfer -
 */
function updateRegions (wavesurfer) {
	const { pre, select, post } = wavesurfer.regions.list
	pre.update({
		start: 0,
		end: select.start
	})
	post.update({
		start: select.end,
		end: wavesurfer.getDuration()
	})
}

/**
 * [getRegionClickHandler description]
 *
 * @param  {object} 	region -
 * @param  {function} update -
 * @param  {string} 	side   -
 */
function getRegionClickHandler (region, update, side) {
	return (e) => {
		const duration = region.end - region.start
		const percentage = (e.offsetX / e.currentTarget.offsetWidth) * 100
		const nextTime = region.start + (duration/100) * percentage
		const direction = side || (percentage < 50 ? 'start' : 'end')
		update({ [`${direction}`]: nextTime })
	}
}
