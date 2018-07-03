<style  lang="css">

#tutorial {
  margin-left: 20px;
  margin-right: 20px;
}

#tutorial h1 {
    text-align:center;
    color: #5d809d;;
    font-family:Raleway;
    font-size:32px;
    margin-top:0px;
    padding-bottom:10px;
    font-weight:normal;
}
#tutorial h2 {
    color:rgb(132, 132, 132);
    font-family:Raleway;
    font-size:24px;
    margin-top:60px;
    padding-bottom:10px;
    font-weight:normal;
}

#tutorial .example-datasets {

  font-size:18px;
  font-family:Raleway;
  display:inline-block;
  width:400px;
  text-align:left;
}

#tutorial div.use-case {
  font-size:22px;
  color:rgb(132, 132, 132);
  font-family:Raleway;
}

#tutorial div.use-case .name {
  width:300px;
  display:inline-block;
  text-align:left;
  font-size:18px;
}
#tutorial div.use-case .description {
  font-size:16px;
  width:170px;
  display:inline-block;
}
#tutorial div.use-case .screencast {
  font-size:16px;
  width:150px;
  display:inline-block;
}
#tutorial div.use-case .link {
  font-size:16px;
  width:100px;
  display:inline-block;
}

#tutorial .videos .video-title {
  font-size: 24px;
}
#tutorial .videos .video-subtitle {
  font-size: 16px;
}

</style>

<style lang="sass">
@import ../../../assets/sass/variables

#tutorial
  .videos
    margin-top: 15px

    ul
      list-style-type: none
      overflow: hidden
      margin: 0
      padding: 0

    li
      width: 31%
      margin: 5px 1%
      padding: 0
      vertical-align: top
      display: inline-block
      margin-bottom: 50px
      box-sizing: border-box
      position: relative

      &:nth-child(3n+1)
        float: left
        clear: both
        margin-right: 2%

      &:nth-child(3n+3)
        float: right
        margin-right: 4px

    .video
      height: 300px
      box-shadow: 2px 2px 6px 2px rgb(200, 200, 200)

    .video-thumbnail
      width: auto
      margin: 10px
      border-radius: 3px
      box-sizing: border-box

      img
        width: 100%
        height: 180px
        border: 1px solid rgb(230, 230, 230)
        border-radius: 3px
        margin: 0px

    .video-text
      margin: -10px 15px 2px 15px
      font-family: 'helvetica'

    .video-byline
      color: rgb(120, 120, 120)
      font-size: 14px
      text-transform: uppercase

    .video-headshot
      height: 50px
      position: absolute
      right: 15px
      top: 126px
      border: 3px solid white
      border-radius: 50px

    .video-title
      font-size: 16px

      a
        text-decoration: none
        color: rgb(70, 70, 70)

    .video-subtitle
      font-size: 16px
      color: rgb(120, 120, 120)
      margin-top: 7px
      margin-bottom: 16px
</style>

<template>



<v-content id="tutorial">
  <v-container fluid >


    <h1 style="text-align:left;margin-top:10px;">gene.iobio Tutorials</h1>

    <h2 style="text-align:left;margin-top:30px;">Datasets</h2>

    <div style="text-align:left">
       <a class="example-datasets" href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2&gene=AIRE"
        target="_example_datasets">
        Platinum trio - whole genome sequencing
       </a>
       <br>
       <a class="example-datasets" href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&gene=RAI1&name0=&bam0=https://s3.amazonaws.com/iobio/samples/bam/NA19240.bam&name1=&bam1=https://s3.amazonaws.com/iobio/samples/bam/NA19238.bam&name2=&bam2=https://s3.amazonaws.com/iobio/samples/bam/NA19239.bam&vcf0=https://s3.amazonaws.com/iobio/samples/vcf/exome-trio.vcf.gz&sample0=NA19240&vcf1=https://s3.amazonaws.com/iobio/samples/vcf/exome-trio.vcf.gz&sample1=NA19238&vcf2=https://s3.amazonaws.com/iobio/samples/vcf/exome-trio.vcf.gz&sample2=NA19239&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1"
       s>
        1000 Genomes project trio - exome sequencing
       </a>
    </div>

    <h2>Use cases</h2>
    <div style="text-align:left">

      <div class="use-case">
        <span class="name">Recessive variant - RAI1</span>
        <span class="description"><a href="#/use-cases?topic=RAI1" target="_self">description</a></span>
        <span class="screencast"><a href="https://www.youtube.com/watch?v=vsnv6YU1gDc" target="_usecase">screencast</a></span>
        <span class="link" ><a href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1&gene=RAI1" target="_usecase">gene.iobio</a>
        </span>

      </div>
      <div class="use-case">
        <span class="name">Realtime variant calling - MYLK2</span>
        <span class="description"><a href="#/use-cases?topic=MYLK2" target="_self">description</a></span>
        <span class="screencast"><a href="https://www.youtube.com/watch?v=l-YsG1C6TkI" target="_usecase">screencast</a></span>
        <span class="link"><a href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1&gene=MYLK2" target="_usecase">gene.iobio</a>
        </span>

      </div>
      <div class="use-case">
        <span class="name" >Low coverage variants - AIRE</span>
        <span class="description"><a href="#/use-cases?topic=AIRE" target="_self">description</a></span>
        <span class="screencast"><a href="https://www.youtube.com/watch?v=MxIyc23HGxc" target="_usecase">screencast</a></span>
        <span class="link"><a href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1&gene=AIRE" target="_usecase">gene.iobio</a>
        </span>

      </div>

      <div class="use-case">
        <span class="name">Alternate transcripts - PDGFB</span>
        <span class="description"><a href="#/use-cases?topic=PDGFB" target="_self">description</a></span>
        <span class="screencast"><a href="https://www.youtube.com/watch?v=k_nfrXgP-N0" target="_usecase">screencast</a></span>
        <span class="link"><a href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1&gene=PDGFB" target="_usecase">gene.iobio</a>
        </span>
      </div>

      <div class="use-case">
        <span class="name">Phenotype driven analysis - PDHA1</span>
        <span class="description"><a href="#/use-cases?topic=PDHA1" target="_self">description</a></span>
        <span class="screencast"><a href="">          </a></span> <!--https://www.youtube.com/watch?v=k_nfrXgP-N0" target="_usecase">screencast</a></span>-->
        <span class="link"><a href="http://newgene.iobio.io/#?rel0=proband&rel1=mother&rel2=father&name0=&vcf0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam0=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam&name1=&vcf1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam1=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam&name2=&vcf2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz&bam2=https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam&sample0=NA12878&sample1=NA12891&sample2=NA12892&genes=RAI1,AIRE,PDGFB,MYLK2,PDHA1&gene=PDHA1" target="_usecase">gene.iobio</a>
        </span>

      </div>
    </div>


    <h2>Screencasts</h2>

    <div class="videos">
      <ul>

        <!-- video 1 -->
        <li class="video">
          <div class='video-thumbnail'><a href="https://www.youtube.com/watch?v=PKml9FQ4AFY"><img src=assets/images/gene.iobio.png></img></a></div>
          <div class='video-text'>
            <div class='video-byline'>30 July 2015</div>
            <div class='video-title'><a href="https://www.youtube.com/watch?v=Pj5WinfmzAs">Introduction to gene.iobio</a></div>
            <div class='video-subtitle'>Overview of basic usage and features</div>
          </div>
        </li>

        <!-- video 2 -->
        <li class="video">
          <div class='video-thumbnail'><a href="https://www.youtube.com/watch?v=vsnv6YU1gDc"><img src='assets/images/screencasts/recessive.png'></img></a></div>
          <div class='video-text'>
            <div class='video-byline'>30 July 2015</div>
            <div class='video-title'><a href="https://www.youtube.com/watch?v=vsnv6YU1gDc">Use Case: recessive variants</a></div>
            <div class='video-subtitle'>Simple view of a recessive variant, pathogenic in clinvar</div>
          </div>
        </li>

        <!-- video 3 -->
        <li class="video">
          <div class='video-thumbnail'><a href="https://www.youtube.com/watch?v=l-YsG1C6TkI"><img src='assets/images/screencasts/real_time_calling.png'></img></a></div>
          <div class='video-text'>
            <div class='video-byline'>30 July 2015</div>
            <div class='video-title'><a href="https://www.youtube.com/watch?v=l-YsG1C6TkI">Use Case: real-time variant calling</a></div>
            <div class='video-subtitle'>Recall variants in realtime from the underlying alignment data</div>
          </div>
        </li>

        <!-- video 4 -->
        <li class="video">
          <div class='video-thumbnail'><a href="https://www.youtube.com/watch?v=MxIyc23HGxc"><img src='assets/images/screencasts/low_coverage.png'></img></a></div>
          <div class='video-text'>
            <div class='video-byline'>30 July 2015</div>
            <div class='video-title'><a href="https://www.youtube.com/watch?v=MxIyc23HGxc">Use Case: low coverage alignments</a></div>
            <div class='video-subtitle'>Variants can be missed as a result of low coverage in the alignments</div>
          </div>
        </li>

        <!-- video 5 -->
        <li class="video">
          <div class='video-thumbnail'><a href="https://www.youtube.com/watch?v=k_nfrXgP-N0"><img src='assets/images/screencasts/alternative_transcripts.png'></img></a></div>
          <div class='video-text'>
            <div class='video-byline'>30 July 2015</div>
            <div class='video-title'><a href="https://www.youtube.com/watch?v=k_nfrXgP-N0">Use Case: alternative transcripts</a></div>
            <div class='video-subtitle'>Annotate variants based on different transcripts</div>
          </div>
        </li>
      </ul>
    </div>

  </v-container>

</v-content>


</template>

<script>

export default {
  name: 'tutorial',
  components: {
  },
  props: {

  },
  data() {
    return {
    }
  }
}
</script>