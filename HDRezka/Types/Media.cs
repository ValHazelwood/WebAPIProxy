using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HDRezka
{
    public class Media
    {
        public int Id { get; set; }
                
        public int CurrentTranslationId { get; set; }

        public MediaType Type { get; set; }

        public int? CurrentSeason { get; set; }

        public int? CurrentEpisode { get; set; }

        public Translation[] Translations { get; set; }
    }
}
