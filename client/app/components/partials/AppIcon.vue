<style lang="sass" >
@import ../../../assets/sass/variables

#clinvar-path-symbol
  fill: rgb(173, 73, 74)

#clinvar-lpath-symbol
  fill: rgb(251, 119, 55)

</style>

<template>
  <div style="display:inline-block">

    <svg
     v-if="icon == 'impact' && (type == 'snp' || type == 'mnp')"
     :icon="icon"
     :type="type"
     :width="width"
     :height="height"
     class="impact-badge">
      <g transform="translate(1,6)">
        <rect width="8" height="8"
        v-bind:class="clazz"
        style="pointer-events: none;"></rect>
      </g>
    </svg>

    <svg
     v-if="icon == 'impact' && type == 'del' "
     :icon="icon"
     :type="type"
     :width="width"
     :height="height"
     class="impact-badge">
      <g transform="translate(5,10)">
        <path d="M0,-4.161791450287817L4.805622828269509,4.161791450287817 -4.805622828269509,4.161791450287817Z"
        v-bind:class="clazz">
        </path>
      </g>
    </svg>

    <svg
     v-if="icon == 'impact' && type == 'ins' "
     :width="width"
     :height="height"
     :icon="icon"
     :type="type"
     class="impact-badge">
      <g transform="translate(5,10)">
        <path d="M0,3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,-3.5682482323055424A3.5682482323055424,3.5682482323055424 0 1,1 0,3.5682482323055424Z"
        v-bind:class="clazz">
        </path>
      </g>
    </svg>

    <svg
     v-if="icon == 'impact' && type == 'complex' "
     :width="width"
     :height="height"
     :icon="icon"
     :type="type"
     :clazz="clazz"
     class="impact-badge">
      <g transform="translate(5,9)">
        <path d="M0,-5.885661912765424L3.398088489694245,0 0,5.885661912765424 -3.398088489694245,0Z"
        v-bind:class="clazz">
        </path>
      </g>
    </svg>


    <svg
     v-if="icon == 'zygosity' && type == 'hom' "
     :width="width"
     :height="height"
     :icon="icon"
     :type="type"
     class="impact-badge">
      <g transform="translate(0,4)">
        <rect width="24" height="10" class="zyg_hom" style="pointer-events: none;">
        </rect>
        <text x="1" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
        Hom
        </text>
      </g>
    </svg>

    <svg
     v-if="icon == 'zygosity' && type == 'het' "
     :width="width"
     :height="height"
     :icon="icon"
     :type="type"
     class="impact-badge">
      <g transform="translate(0,4)">
        <rect width="24" height="10" class="zyg_het" style="pointer-events: none;">
        </rect>
        <text x="2" y="8" style="fill: white; font-weight: bold; font-size: 9px;">
        Het
        </text>
      </g>
    </svg>


    <svg  v-if="icon == 'denovo' || icon == 'de novo'" id="denovo-symbol" viewBox="0 0 27 27" :width="width" :height="height">
      <circle style="fill:#C1272D;stroke:#000000;stroke-miterlimit:10;" cx="8" cy="4" r="3.5"/>
      <g>
        <path style="fill:#717171;" d="M7.8,11.1c1-0.2,2.3-0.3,3.7-0.3c2.3,0,3.8,0.4,5,1.3c1.3,0.9,2.1,2.4,2.1,4.6c0,2.3-0.8,3.9-2,4.9
          c-1.3,1.1-3.2,1.6-5.6,1.6c-1.4,0-2.4-0.1-3.1-0.2L7.8,11.1L7.8,11.1z M10.6,21c0.2,0.1,0.6,0.1,1,0.1c2.5,0,4.1-1.4,4.1-4.2
          c0-2.5-1.5-3.9-3.8-3.9c-0.6,0-1,0.1-1.2,0.1V21H10.6z"/>
      </g>
      <line style="fill:none;stroke:#000000;stroke-width:3;stroke-miterlimit:10;" x1="17.6" y1="0.1" x2="17.6" y2="7.9"/>
      <line style="fill:none;stroke:#000000;stroke-width:3;stroke-miterlimit:10;" x1="13.7" y1="4" x2="21.5" y2="4"/>
    </svg>



    <svg  v-if="icon == 'recessive'" id="recessive-symbol" viewBox="0 0 27 27" :width="width" :height="height" >
      <circle fill="#C1272D" stroke="#000000" stroke-miterlimit="10" cx="7.6" cy="4" r="3.5"/>
      <circle fill="#C1272D" stroke="#000000" stroke-miterlimit="10" cx="16.6" cy="4" r="3.5"/>
      <g>
        <path fill="#717171" d="M7.6,11.2c0.9-0.1,2.2-0.3,3.7-0.3c1.8,0,3.1,0.3,3.9,1c0.7,0.6,1.1,1.4,1.1,2.5c0,1.5-1.1,2.6-2.1,3v0.1
          c0.8,0.3,1.3,1.2,1.6,2.3c0.4,1.4,0.8,3,1,3.4h-2.8c-0.2-0.3-0.5-1.3-0.8-2.8c-0.3-1.5-0.8-1.9-2-1.9h-0.8v4.8H7.6V11.2z
           M10.3,16.4h1.1c1.4,0,2.2-0.7,2.2-1.7c0-1.1-0.8-1.7-2-1.7c-0.7,0-1,0.1-1.2,0.1V16.4z"/>
      </g>
    </svg>

    <svg v-if="icon == 'x-linked' || icon == 'xlinked' || icon == 'x linked'"  id="x-linked-symbol"  viewBox="0 0 27 27" :width="width" :height="height">
      <circle style="fill:#C1272D;stroke:#000000;stroke-miterlimit:10;" cx="13" cy="4" r="3.5"/>
      <g>
        <path style="fill:#717171;" d="M15.8,21.8l-1.1-2.2c-0.5-0.8-0.7-1.5-1.1-2.2h0c-0.3,0.7-0.6,1.3-0.9,2.2l-1,2.2H8.5l3.5-6.1
        l-3.4-6h3.2l1.1,2.2c0.4,0.7,0.6,1.3,0.9,2h0c0.3-0.8,0.5-1.3,0.8-2l1-2.2h3.1l-3.4,5.9l3.6,6.2H15.8z"/>
      </g>
    </svg>

    <svg v-if="icon == 'compound-het' || icon == 'compound het' || icon == 'compoundHet'"  id="compound-het-symbol" viewBox="0 0 27 27" :width="width" :height="height">
      <circle style="fill:#C1272D;stroke:#000000;stroke-miterlimit:10;" cx="8" cy="4" r="3.5"/>
      <circle style="fill:#DB7F05;stroke:#000000;stroke-miterlimit:10;" cx="17" cy="4" r="3.5"/>
      <g>
        <path style="fill:#717171;" d="M11,21.2c-0.5,0.2-1.5,0.5-2.9,0.5c-4,0-6-2.5-6-5.7c0-3.9,2.8-6.1,6.3-6.1c1.3,0,2.4,0.3,2.8,0.5
          l-0.5,2.1C10.1,12.2,9.4,12,8.5,12c-2.1,0-3.7,1.2-3.7,3.8c0,2.3,1.4,3.7,3.7,3.7c0.8,0,1.6-0.2,2.2-0.4L11,21.2z"/>
        <path style="fill:#717171;" d="M15.3,10v4.4h4.3V10h2.6v11.5h-2.6v-4.8h-4.3v4.8h-2.6V10H15.3z"/>
      </g>
    </svg>

    <svg  v-if="icon == 'autosomal-dominant' || icon == 'autosomal dominant' || icon == 'autosomalDominant'" id="autosomal-dominant-symbol" viewBox="0 0 27 27" :width="width" :height="height" >
      <circle fill="#C1272D" stroke="#000000" stroke-miterlimit="10" cx="9.6" cy="4" r="3.5"/>
      <circle fill="#FFFFFF" stroke="#000000" stroke-miterlimit="10" cx="18.6" cy="4" r="3.5"/>
      <g>
        <g>
          <path fill="#717171" d="M3.2,21.5L7.7,10h1.8L14,21.5h-2.4l-1.1-2.9h-4l-1.1,2.9H3.2z M8.6,12.4L7,17h3.3L8.6,12.4z"/>
          <path fill="#717171" d="M14.7,21.5V10h4.2c0.9,0,1.8,0.2,2.5,0.5c0.7,0.3,1.3,0.7,1.8,1.2c0.5,0.5,0.8,1.1,1.1,1.8
            c0.2,0.7,0.4,1.4,0.4,2.2c0,0.9-0.1,1.7-0.4,2.4c-0.3,0.7-0.6,1.3-1.1,1.8c-0.5,0.5-1.1,0.9-1.8,1.2c-0.7,0.3-1.5,0.4-2.3,0.4
            H14.7z M22.3,15.7c0-0.6-0.1-1.1-0.2-1.5c-0.2-0.5-0.4-0.9-0.7-1.2c-0.3-0.3-0.7-0.6-1.1-0.8c-0.4-0.2-0.9-0.3-1.5-0.3h-1.9v7.6
            h1.9c0.6,0,1-0.1,1.5-0.3c0.4-0.2,0.8-0.5,1.1-0.8c0.3-0.3,0.5-0.7,0.7-1.2C22.2,16.8,22.3,16.3,22.3,15.7z"/>
        </g>
      </g>
    </svg>


    <svg v-if="icon == 'clinvar'" id="clinvar-symbol" :width="width" :height="height" viewBox="0 0 16 16">
      <path d="M14 4h-3v-2c0-0.55-0.45-1-1-1h-4c-0.55 0-1 0.45-1 1v2h-3c-1.1 0-2 0.9-2 2v8c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-8c0-1.1-0.9-2-2-2zM6 2h4v2h-4v-2zM12 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"  />
    </svg>
    <svg v-if="icon == 'clinvar-path' || icon =='clinvar_path'" id="clinvar-path-symbol" :width="width" :height="height" viewBox="0 0 16 16">
      <path d="M14 4h-3v-2c0-0.55-0.45-1-1-1h-4c-0.55 0-1 0.45-1 1v2h-3c-1.1 0-2 0.9-2 2v8c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-8c0-1.1-0.9-2-2-2zM6 2h4v2h-4v-2zM12 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"  />
    </svg>
    <svg v-if="icon == 'clinvar-lpath' || icon == 'clinvar_lpath'" id="clinvar-lpath-symbol" :width="width" :height="height" viewBox="0 0 16 16">
      <path d="M14 4h-3v-2c0-0.55-0.45-1-1-1h-4c-0.55 0-1 0.45-1 1v2h-3c-1.1 0-2 0.9-2 2v8c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-8c0-1.1-0.9-2-2-2zM6 2h4v2h-4v-2zM12 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"  />
    </svg>


    <svg v-if="icon == 'af'"  id="af-symbol" :width="width" :height="height" viewBox="0 0 18 16">
      <path d="M12 12.041v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z" >
      </path>
      <path d="M5.112 12.427c0.864-0.565 1.939-0.994 3.122-1.256-0.235-0.278-0.449-0.588-0.633-0.922-0.475-0.863-0.726-1.813-0.726-2.748 0-1.344 0-2.614 0.478-3.653 0.464-1.008 1.299-1.633 2.488-1.867-0.264-1.195-0.968-1.98-2.841-1.98-3 0-3 2.015-3 4.5 0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h4.359c0.227-0.202 0.478-0.393 0.753-0.573z" >
      </path>
    </svg>

    <svg v-if="icon == 'coverage'"  :width="width" :height="height" viewBox="0 0 18 18"class="gene-badge-coverage-problem" >
      <g transform="translate(0,1)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#trending-down-symbol" width="17" height="17"  style="pointer-events: none;">
        </use>
      </g>
    </svg>
  </div>

</template>

<script>
export default {
  name: 'app-icon',
  components: {
  },
  props: {
    icon: null,
    type: null,
    clazz: null,
    width: null,
    height: null
  },
  data () {
    return {
    }
  }
}
</script>

