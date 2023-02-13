import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { EffectComposer, SSAO } from 'react-postprocessing'

// see https://vanruesc.github.io/postprocessing/public/docs/class/src/effects/SSAOEffect.js~SSAOEffect.html
const aoConfig = {
  high: {
    samples: 80,
    rings: 10,
    radius: 2,
    intensity: 50
  },
  mid: {
    samples: 40,
    rings: 7,
    radius: 2,
    intensity: 30
  },
  low: {
    samples: 9,
    rings: 7,
    radius: 2,
    intensity: 20
  }
}

const Post = ({ aoPreset }) => (
  <Suspense fallback={null}>
    <EffectComposer smaa>
      <SSAO {...aoConfig[aoPreset]} />
    </EffectComposer>
  </Suspense>
)

Post.aoPresetsTypes = {
  high: 'high',
  mid: 'mid',
  low: 'low'
}

Post.defaultProps = {
  aoPreset: Post.aoPresetsTypes.high
}

Post.propTypes = {
  aoPreset: PropTypes.string
}

export default Post
