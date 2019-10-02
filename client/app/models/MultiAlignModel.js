import BarChartD3          from '../d3/BarChart.d3.js';
import MultiAlignD3        from '../d3/MultiAlign.d3.js';
class MultiAlignModel {

    constructor() {
      this.scores = [];
      this.selectedScore = null;

      this.multialign_service   = "http://multialign.iobio.io:8081";
      this.default_species_list = "Human,Rhesus,Rattus,Mouse,Zebrafish";

      this.sequenceWindow = {
        'nuc': 5,
        'aa': 15
      }

      this.primarySpeciesName = "hg19";

      this.speciesMap = {
        hg19:    'Human'
      }


    }

    clear() {
      this.selectedScore = null;
    }

    hasConservationScores(regionStart, regionEnd, selectedGene) {
      let self = this;
      let region = selectedGene.chr + ":" + regionStart + "-" + regionEnd;
      let key = selectedGene.gene_name + "-" + region;

      if (self.scores[key]) {
        let theScores = self.scores[key].filter(function(score) {
          return score.x >= regionStart && score.x <= regionEnd;
        })
        return theScores.length > 0;
      } else {
        return false;
      }
    }

    promiseGetConservationScores(regionStart, regionEnd, selectedGene, selectedVariant, build) {
      let self = this;

      return new Promise(function(resolve, reject) {
        let geneName = selectedGene.gene_name;
        let region = selectedGene.chr + ":" + regionStart + "-" + regionEnd;
        let key = geneName + "-" + region;

        if (self.scores[key] == null || self.scores[key].length == 0) {
          self.scores[key] = [];

          let get_scores_url = self.multialign_service + "/phylop?build=" + build + "&region=" + region;
          $.ajax({
            url: get_scores_url ,
            type: 'GET',
            contentType: 'text'
          })
          .done(data => {

            data.split("\n").forEach(function(rec) {
              if (rec.length > 0) {
                let fields = rec.split("\t")
                self.scores[key].push({  'x': +fields[1], 'y': +fields[3]});
              }
            })
            let scoreData = self.getConservationScores(self.scores[key],
                                                          'mean',
                                                          200,
                                                          regionStart, regionEnd, selectedVariant.start);
            self.setSelectedScore(key, selectedVariant.start)

            resolve(scoreData);

          })
          .fail(error => {
            console.log("Error getting phylop scores ");
            console.log(error);
            reject(error);
          })

        } else {
          let scoreData = self.getConservationScores(self.scores[key],
                                                        'mean',
                                                        200,
                                                        regionStart, regionEnd, selectedVariant.start);
          self.setSelectedScore(key, selectedVariant.start)
          resolve(scoreData);

        }

      })


    }


    promiseGetMultiAlignments(selectedGene, selectedVariant, build, seqType) {
      let self = this;

      return new Promise(function(resolve, reject) {
        let promises = [];
        self._promiseGetMultiAlignmentsImpl(selectedGene.gene_name, selectedVariant.start, build, seqType)
        .then(function(alignments) {
          self.setMultiAlignSimilarity(alignments);

          let data = self.getMultiAlignSequencesForVariant(alignments, selectedVariant.start, self.sequenceWindow[seqType], seqType);
          resolve(data);
        })
      })
    }


    setSelectedScore(key, position) {
      let self = this;
      let theScores = self.scores[key].filter(function(score) {
          return position >= score.x  && position <= score.x;
      })
      if (theScores.length > 0) {
        self.selectedScore = theScores[0];
      } else {
        self.selectedScore = null;
      }
    }

    getMultiAlignSequencesForExon(alignments, index) {
      let self = this;
      let sequences = [];
      alignments.forEach(function(alignment) {
        let region = alignment.regions[index];
        sequences.push({name: region.species, sequence: alignment.sequences[index]});
      })
      return sequences;
    }


    getMultiAlignSequencesForVariant(alignments, start, regionLength, seqType) {
      let self = this;

      let filteredSequences = [];
      let selectedBase = null;
      let windowStart = start - regionLength;
      let windowEnd   = start + regionLength;

      if (alignments.length == 0) {
        return  {sequences: [], selectedBase: null};
      }


      let regionIndex = -1;
      alignments[0].regions.forEach(function(region, i) {
        if (start >= region.start  && start <= region.end) {
          regionIndex = i;
        }
      })
      if (regionIndex >= 0) {
        let selectedBases = alignments[0].sequences[regionIndex].filter(function(seq) {
          if (seqType == 'nuc') {
            return seq.start == start;
          } else if (seqType == 'aa') {
            return seq.start >= start - 1 && seq.start <= start + 1;
          }
        })
        if (selectedBases.length > 0) {
          selectedBase = selectedBases[0]
        }
        let sequences = self.getMultiAlignSequencesForExon(alignments, regionIndex)
        sequences.forEach(function(sequence) {
          let filteredSeqs = sequence.sequence.filter(function(seq) {
            return seq.start >= windowStart && seq.start <= windowEnd;
          })
          filteredSequences.push({name: sequence.name, sequence: filteredSeqs})
        })
      }

      return {sequences: filteredSequences, selectedBase: selectedBase};
    }

    _promiseGetMultiAlignmentsImpl(geneName, start, build, seqType="nuc") {
      let self = this;

      return new Promise(function(resolve, reject) {

        let get_multialign_url = self.multialign_service + "/sequence"
              + "?build=" + build
              + "&gene=" + geneName
              + "&type=" + seqType
              + "&pos=" + start
              + "&species=" + self.default_species_list;
        $.ajax({
          url: get_multialign_url ,
          type: 'GET',
          contentType: 'text'
        })
        .done(data => {
          let alignments = []

          let geneName = null;
          let species = null;
          let speciesAbbrev = null;
          let chrom = null;
          let start= null;
          let end = null;

          let buf = "";
          let regions = [];
          let sequences = [];

          data.split("\n").forEach(function(rec) {
            if (rec.indexOf("##") == 0) {

              if (buf.length > 0) {
                let sequence = Array.from(buf, function(character, i) {
                  let offset = i;
                  if (seqType == "aa") {
                    offset = i*3;
                  }
                  return {start: offset + start, offset: offset, base: character }
                })
                sequences.push(sequence)
                buf = "";

                alignments.push({species: species, geneName: geneName, sequences: sequences, regions: regions})
              }


              let speciesRec = rec.substring(2, rec.length);
              let tokens = speciesRec.split(",");
              species = tokens[0];
              speciesAbbrev = tokens[1];
              self.speciesMap[speciesAbbrev] = species;
              sequences = [];
              regions = [];

            } else if (rec.indexOf("#") == 0) {

              if (buf.length > 0) {
                let sequence = Array.from(buf, function(character, i) {
                  let offset = i;
                  if (seqType == "aa") {
                    offset = i*3;
                  }
                  return {start: offset + start, offset: offset, base: character }
                })
                sequences.push(sequence)
                buf = "";
              }

              let tokens       = rec.split(" ");

              geneName         = tokens[0].substr(1, tokens.length+1)

              let region       = tokens[1].substr(0, tokens[1].length-1);

              let regionTokens = region.split(":");
              if (regionTokens.length > 1) {
                chrom            = regionTokens[0];
                let posTokens    = regionTokens[1].split("-");
                start            = Number(posTokens[0]);
                end              = Number(posTokens[1]);
              } else {
                chrom = "";
                start = 0;
                end = 0;
              }

              if (tokens.length > 2) {
                species          = tokens[2];
              }


              regions.push({chrom: chrom, start: start, end: end, species: self.speciesMap[speciesAbbrev], geneName: geneName })


            } else if (rec.indexOf(">") == 0) {

            } else {
              buf += rec;
            }
          })


          let sequence = Array.from(buf, function(character, i) {
            let offset = i;
            if (seqType == "aa") {
              offset = i*3;
            }
            return {start: offset + start, offset: offset, base: character }
          })
          sequences.push(sequence)
          alignments.push({species: species, geneName: geneName, sequences: sequences, regions: regions});

          resolve(alignments)

        })
        .fail(error => {
          console.log("Error getting multialign sequence");
          console.log(error);
          reject(error);
        })
      })

    }


    setMultiAlignSimilarity(alignments) {
      let self = this;
      let primaryAlignment = alignments[0];
      for (var i = 0; i < primaryAlignment.sequences.length; i++) {
        let primarySequence    = primaryAlignment.sequences[i];
        let primaryRegion      = primaryAlignment.regions[i];

        for (var j = 0; j < primarySequence.length; j++) {
          let primarySeq = primarySequence[j];
          primarySeq.start = primaryRegion.start + primarySeq.offset;

          for (var x = 1; x < alignments.length; x++) {
            let theSeq = alignments[x].sequences[i][j];
            theSeq.start = primaryRegion.start + theSeq.offset;
            if (theSeq.base == primarySeq.base) {
              theSeq.clazz = "same";
            } else {
              theSeq.clazz = "diff"
            }
          }
        }
      }
    }


    getConservationScores(scoresAll, reducePointsType, pixels, start, end, position) {
      let self = this;

      let options = {showYAxis: true, xScale: 'linear', showXAxis: false}


      let theScores = scoresAll;
      if (start && end) {
        theScores = scoresAll.filter(function(score) {
          return score.x >= start && score.x <= end;
        })
        options.tickCount = 3;
      }

      let scores = self.reducePoints(theScores, pixels/4, null, reducePointsType)


      let targetScore = null;
      if (position != null) {
        let targetScores = scores.filter(function(score) {
          if (position >= score.x && position <= score.xEnd) {
            return true;
          } else {
            return false;
          }
        })
        if (targetScores.length > 0) {
          targetScore = targetScores[0]
        }
      }

      return {'scores': scores, 'targetScore': targetScore, 'options': options};
    }

    reducePoints(data, pixels=500, reduceByFactor=0, type="mean") {
      let self = this;
      let factor = reduceByFactor > 0 ? reduceByFactor : Math.round(data.length / pixels)
      if (factor <= 1) {
        return data;
      } else {
        let i = 0;
        let j = 0;
        let results = [];
        let sum = 0;
        let max = 0;
        let min = 0;

        // Create a sliding window of averages
        for(i = 0; i < data.length; i+= factor) {
          // Slice from i to factor
          let avgWindow = data.slice(i, i+factor);
          for (j = 0; j < avgWindow.length; j++) {
              var y = avgWindow[j].y;
              sum += y != null ? y : 0;
              max = Math.max(max, y)
              min = Math.min(min, y)
          }
          let entry = {'x': data[i].x, 'xEnd': ((+data[i].x + factor) - 1)};
          if (type == 'mean') {
            entry.y = sum / factor;
          } else if (type == 'min') {
            entry.y = min;
          } else if (type == 'max') {
            entry.y = max;
          }
          results.push(entry)
          sum = 0;
          max = 0;
          min = 0;
        }
        return results;
      }
    }
}
export default MultiAlignModel